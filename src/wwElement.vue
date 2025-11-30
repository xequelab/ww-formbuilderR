<template>
<div class="form-builder">
<div class="form-builder-grid">
<FieldPalette />

<FormCanvas
:fields="fields"
:selected-field-id="selectedFieldId"
:service-name="content.serviceName"
@update:fields="updateFields"
@select-field="selectField"
@save="handleSave"
@preview="showPreview = true"
@clear="clearAllFields"
@close="handleClose"
/>

<PropertiesPanel
:selected-field="selectedField"
@update:selected-field="updateSelectedField"
@close="selectedFieldId = null"
/>
</div>

<PreviewModal
:is-open="showPreview"
:fields="fields"
@close="showPreview = false"
/>
</div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import FieldPalette from './components/FieldPalette.vue';
import FormCanvas from './components/FormCanvas.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';
import PreviewModal from './components/PreviewModal.vue';

export default {
name: 'FormBuilder',
components: {
FieldPalette,
FormCanvas,
PropertiesPanel,
PreviewModal
},
props: {
content: {
type: Object,
required: true
},
uid: {
type: String,
required: true
},
/* wwEditor:start */
wwEditorState: {
type: Object,
required: true
},
/* wwEditor:end */
},
emits: ['trigger-event'],
setup(props, { emit }) {
const isEditing = computed(() => {
/* wwEditor:start */
return props.wwEditorState?.isEditing;
/* wwEditor:end */
// eslint-disable-next-line no-unreachable
return false;
});

const fields = ref([]);
const selectedFieldId = ref(null);
const showPreview = ref(false);

const { value: formSchema, setValue: setFormSchema } = wwLib.wwVariable.useComponentVariable({
uid: props.uid,
name: 'formSchema',
type: 'object',
defaultValue: { fields: [] }
});

const selectedField = computed(() => {
if (!selectedFieldId.value) return null;
return fields.value.find(f => f.id === selectedFieldId.value) || null;
});

const updateFields = (newFields) => {
fields.value = newFields;
updateFormSchema();
};

const selectField = (fieldId) => {
selectedFieldId.value = fieldId;
};

const updateSelectedField = (updatedField) => {
const index = fields.value.findIndex(f => f.id === updatedField.id);
if (index !== -1) {
fields.value[index] = updatedField;
updateFormSchema();
}
};

const updateFormSchema = () => {
const schema = {
fields: fields.value.map(field => ({
id: field.id,
type: field.type,
label: field.label,
fieldId: field.fieldId,
placeholder: field.placeholder,
required: field.required,
helpText: field.helpText,
...(field.locked && { locked: field.locked }),
...(field.options && { options: field.options }),
...(field.min !== null && field.min !== undefined && { min: field.min }),
...(field.max !== null && field.max !== undefined && { max: field.max }),
...(field.step !== null && field.step !== undefined && { step: field.step }),
...(field.maxLength !== null && field.maxLength !== undefined && { maxLength: field.maxLength }),
...(field.country && { country: field.country }),
...(field.mask && { mask: field.mask }),
...(field.defaultValue !== null && field.defaultValue !== undefined && { defaultValue: field.defaultValue }),
...(field.showValue !== null && field.showValue !== undefined && { showValue: field.showValue }),
...(field.unit && { unit: field.unit }),
...(field.labelOn && { labelOn: field.labelOn }),
...(field.labelOff && { labelOff: field.labelOff }),
...(field.title && { title: field.title }),
...(field.description && { description: field.description }),
...(field.autocomplete !== null && field.autocomplete !== undefined && { autocomplete: field.autocomplete }),
...(field.fields && { fields: field.fields }),
...(field.url && { url: field.url }),
...(field.linkText && { linkText: field.linkText }),
...(field.openNewTab !== null && field.openNewTab !== undefined && { openNewTab: field.openNewTab }),
...(field.consentText && { consentText: field.consentText }),
...(field.linkUrl && { linkUrl: field.linkUrl })
}))
};
setFormSchema(schema);

if (!isEditing.value) {
emit('trigger-event', {
name: 'change',
event: { value: schema }
});
}
};

const handleSave = () => {
if (isEditing.value) return;

const schema = formSchema.value;
emit('trigger-event', {
name: 'save',
event: {
schema: schema,
fieldsCount: fields.value.length
}
});
};

const clearAllFields = () => {
if (isEditing.value) return;

const confirmed = wwLib.getFrontWindow().confirm('Tem certeza que deseja limpar todos os campos adicionais? Os campos obrigatórios (Nome, Email, Telefone) serão mantidos.');
if (confirmed) {
// Remove apenas campos não bloqueados
fields.value = fields.value.filter(field => field.locked);
selectedFieldId.value = null;
updateFormSchema();

emit('trigger-event', {
name: 'clear',
event: { value: true }
});
}
};

const handleClose = () => {
if (isEditing.value) return;

emit('trigger-event', {
name: 'close',
event: { value: true }
});
};

const exportSchema = () => {
return formSchema.value;
};

const importSchema = (schema) => {
if (schema && Array.isArray(schema.fields)) {
fields.value = schema.fields;
updateFormSchema();
return true;
}
return false;
};

// Campos obrigatórios padrão do sistema
const defaultFields = [
{
id: "3d0bd1a7-f76b-4322-97e9-6ff6ec22cfeb",
type: "text",
label: "Seu nome",
fieldId: "field_1761658382742",
helpText: "",
required: false,
maxLength: 60,
placeholder: "",
locked: true
},
{
id: "1c1e5409-5f7d-4f04-b1bf-6d65a384f41f",
type: "email",
label: "E-mail",
fieldId: "field_1761658439505",
helpText: "",
required: true,
placeholder: "Digite seu email",
locked: true
},
{
id: "12c12c98-9c85-4d6a-a965-32fbf6e77559",
mask: "(99) 99999-9999",
type: "phone",
label: "Telefone",
country: "BR",
fieldId: "field_1761658455873",
helpText: "",
required: true,
placeholder: "",
locked: true
}
];

// Inicializa com campos padrão
fields.value = JSON.parse(JSON.stringify(defaultFields));

watch(() => props.content?.initialSchema, (newSchema) => {
if (newSchema) {
let parsedSchema = null;

// Se o schema vem como string JSON (formato do backend)
if (newSchema.schema && typeof newSchema.schema === 'string') {
try {
parsedSchema = JSON.parse(newSchema.schema);
} catch (e) {
console.error('Erro ao fazer parse do schema:', e);
return;
}
}
// Se já vem como objeto com fields
else if (newSchema.fields) {
parsedSchema = newSchema;
}

if (parsedSchema && Array.isArray(parsedSchema.fields)) {
// Mantém os campos padrão bloqueados e adiciona os campos do schema inicial
const defaultFieldIds = defaultFields.map(f => f.id);
const additionalFields = parsedSchema.fields.filter(f => !defaultFieldIds.includes(f.id));
fields.value = [...JSON.parse(JSON.stringify(defaultFields)), ...additionalFields];
updateFormSchema();
}
}
}, { immediate: true, deep: true });

return {
isEditing,
fields,
selectedFieldId,
selectedField,
showPreview,
updateFields,
selectField,
updateSelectedField,
handleSave,
handleClose,
clearAllFields,
exportSchema,
importSchema
};
}
};
</script>

<style scoped>
.form-builder {
width: 100%;
height: 100vh;
position: relative;
}

.form-builder-grid {
display: grid !important;
grid-template-columns: 250px 1fr 320px !important;
grid-template-rows: 100% !important;
height: 100%;
width: 100%;
background: #f9fafb;
overflow: hidden;
gap: 0;
}

.form-builder-grid > * {
height: 100%;
overflow: hidden;
min-width: 0;
}

@media (max-width: 1024px) {
.form-builder-grid {
grid-template-columns: 200px 1fr 280px !important;
}
}

@media (max-width: 768px) {
.form-builder-grid {
grid-template-columns: 1fr !important;
grid-template-rows: auto auto auto !important;
height: auto;
}
}
</style>