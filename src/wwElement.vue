<template>
<div class="form-builder">
<FieldPalette />
    
<FormCanvas
:fields="fields"
:selected-field-id="selectedFieldId"
@update:fields="updateFields"
@select-field="selectField"
@preview="showPreview = true"
@clear="clearAllFields"
/>

<PropertiesPanel
:selected-field="selectedField"
@update:selected-field="updateSelectedField"
@close="selectedFieldId = null"
/>

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
...(field.options && { options: field.options }),
...(field.min !== null && field.min !== undefined && { min: field.min }),
...(field.max !== null && field.max !== undefined && { max: field.max }),
...(field.step !== null && field.step !== undefined && { step: field.step }),
...(field.maxLength !== null && field.maxLength !== undefined && { maxLength: field.maxLength })
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

const clearAllFields = () => {
if (isEditing.value) return;

const confirmed = wwLib.getFrontWindow().confirm('Are you sure you want to clear all fields?');
if (confirmed) {
fields.value = [];
selectedFieldId.value = null;
updateFormSchema();

emit('trigger-event', {
name: 'clear',
event: { value: true }
});
}
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

watch(() => props.content?.initialSchema, (newSchema) => {
if (newSchema && Array.isArray(newSchema.fields) && fields.value.length === 0) {
fields.value = JSON.parse(JSON.stringify(newSchema.fields));
updateFormSchema();
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
clearAllFields,
exportSchema,
importSchema
};
}
};
</script>

<style scoped>
.form-builder {
display: grid;
grid-template-columns: 250px 1fr 320px;
height: 100vh;
background: #f9fafb;
overflow: hidden;
}

@media (max-width: 1024px) {
.form-builder {
grid-template-columns: 200px 1fr 280px;
}
}

@media (max-width: 768px) {
.form-builder {
grid-template-columns: 1fr;
}
}
</style>