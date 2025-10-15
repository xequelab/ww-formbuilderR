<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3 class="panel-title">Propriedades do Campo</h3>
      <button
        v-if="selectedField"
        class="close-btn"
        @click="$emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="!selectedField" class="no-selection">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Selecione um campo para editar suas propriedades</p>
    </div>
    
    <div v-else class="panel-content">
      <div class="property-group">
        <label class="property-label">Rótulo</label>
        <input
          v-model="localField.label"
          type="text"
          class="property-input"
          placeholder="Rótulo do campo"
          @input="updateField"
        />
      </div>

      <div class="property-group">
        <label class="property-label">ID do Campo</label>
        <input
          v-model="localField.fieldId"
          type="text"
          class="property-input"
          placeholder="id_do_campo"
          @input="updateField"
        />
        <p class="property-hint">Identificador único para este campo</p>
      </div>

      <div class="property-group">
        <label class="property-label">Placeholder</label>
        <input
          v-model="localField.placeholder"
          type="text"
          class="property-input"
          placeholder="Digite o texto de exemplo"
          @input="updateField"
        />
      </div>

      <div class="property-group checkbox-group">
        <label class="checkbox-label">
          <input
            v-model="localField.required"
            type="checkbox"
            @change="updateField"
          />
          <span>Campo obrigatório</span>
        </label>
      </div>

      <div class="property-group">
        <label class="property-label">Texto de Ajuda</label>
        <textarea
          v-model="localField.helpText"
          class="property-textarea"
          placeholder="Texto de ajuda adicional"
          rows="3"
          @input="updateField"
        ></textarea>
      </div>
      
      <!-- Number specific properties -->
      <template v-if="localField.type === 'number'">
        <div class="property-divider"></div>
        <h4 class="property-section-title">Configurações de Número</h4>

        <div class="property-group">
          <label class="property-label">Valor Mínimo</label>
          <input
            v-model.number="localField.min"
            type="number"
            class="property-input"
            placeholder="Mínimo"
            @input="updateField"
          />
        </div>

<div class="property-group">
<label class="property-label">Valor Máximo</label>
<input
v-model.number="localField.max"
type="number"
class="property-input"
placeholder="Máximo"
@input="updateField"
/>
</div>

<div class="property-group">
<label class="property-label">Incremento</label>
<input
v-model.number="localField.step"
type="number"
class="property-input"
placeholder="1"
@input="updateField"
/>
</div>
</template>

<!-- Text/Textarea specific properties -->
<template v-if="['text', 'textarea'].includes(localField.type)">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações de Texto</h4>

<div class="property-group">
<label class="property-label">Comprimento Máximo</label>
<input
v-model.number="localField.maxLength"
type="number"
class="property-input"
placeholder="Sem limite"
@input="updateField"
/>
</div>
</template>

<!-- Select/Radio specific properties -->
<template v-if="['select', 'radio'].includes(localField.type)">
<div class="property-divider"></div>
<h4 class="property-section-title">Opções</h4>

<div
v-for="(option, index) in localField.options"
:key="index"
class="option-item"
>
<div class="option-inputs">
<input
v-model="option.label"
type="text"
class="option-input"
placeholder="Rótulo"
@input="updateField"
/>
<input
v-model="option.value"
type="text"
class="option-input"
placeholder="Valor"
@input="updateField"
/>
</div>
<button
class="option-delete-btn"
@click="removeOption(index)"
:disabled="localField.options.length <= 1"
>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>
</button>
</div>

<button class="add-option-btn" @click="addOption">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
</svg>
Adicionar Opção
</button>
</template>
</div>
</div>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
name: 'PropertiesPanel',
props: {
selectedField: {
type: Object,
default: null
}
},
emits: ['update:selectedField', 'close'],
setup(props, { emit }) {
const localField = ref(null);

watch(() => props.selectedField, (newField) => {
if (newField) {
localField.value = JSON.parse(JSON.stringify(newField));
} else {
localField.value = null;
}
}, { immediate: true, deep: true });

const updateField = () => {
if (localField.value) {
emit('update:selectedField', JSON.parse(JSON.stringify(localField.value)));
}
};

const addOption = () => {
if (localField.value && localField.value.options) {
const optionNumber = localField.value.options.length + 1;
localField.value.options.push({
label: `Opção ${optionNumber}`,
value: `option${optionNumber}`
});
updateField();
}
};

const removeOption = (index) => {
if (localField.value && localField.value.options && localField.value.options.length > 1) {
localField.value.options.splice(index, 1);
updateField();
}
};

return {
localField,
updateField,
addOption,
removeOption
};
}
};
</script>

<style scoped>
.properties-panel {
height: 100%;
display: flex;
flex-direction: column;
background: #ffffff;
border-left: 1px solid #e5e7eb;
}

.panel-header {
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px;
border-bottom: 1px solid #e5e7eb;
}

.panel-title {
font-size: 14px;
font-weight: 600;
color: #111827;
margin: 0;
text-transform: uppercase;
letter-spacing: 0.5px;
}

.close-btn {
display: flex;
align-items: center;
justify-content: center;
width: 28px;
height: 28px;
padding: 0;
border: none;
border-radius: 6px;
background: transparent;
color: #6b7280;
cursor: pointer;
transition: all 0.2s ease;
}

.close-btn:hover {
background: #f3f4f6;
color: #111827;
}

.close-btn svg {
width: 18px;
height: 18px;
}

.no-selection {
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 40px 20px;
text-align: center;
}

.no-selection svg {
width: 48px;
height: 48px;
color: #d1d5db;
margin-bottom: 12px;
}

.no-selection p {
font-size: 14px;
color: #6b7280;
margin: 0;
}

.panel-content {
flex: 1;
overflow-y: auto;
padding: 16px;
}

.property-group {
margin-bottom: 20px;
}

.property-label {
display: block;
font-size: 13px;
font-weight: 500;
color: #374151;
margin-bottom: 6px;
}

.property-input,
.property-textarea {
width: 100%;
padding: 8px 12px;
font-size: 14px;
border: 1px solid #d1d5db;
border-radius: 6px;
background: #ffffff;
color: #111827;
transition: all 0.2s ease;
}

.property-input:focus,
.property-textarea:focus {
outline: none;
border-color: #3b82f6;
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.property-textarea {
resize: vertical;
font-family: inherit;
}

.property-hint {
font-size: 12px;
color: #6b7280;
margin: 4px 0 0 0;
}

.checkbox-group {
margin-bottom: 16px;
}

.checkbox-label {
display: flex;
align-items: center;
gap: 8px;
font-size: 14px;
color: #374151;
cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
width: 16px;
height: 16px;
cursor: pointer;
}

.property-divider {
height: 1px;
background: #e5e7eb;
margin: 24px 0 16px 0;
}

.property-section-title {
font-size: 13px;
font-weight: 600;
color: #111827;
margin: 0 0 16px 0;
text-transform: uppercase;
letter-spacing: 0.5px;
}

.option-item {
display: flex;
gap: 8px;
margin-bottom: 8px;
}

.option-inputs {
flex: 1;
display: flex;
gap: 8px;
}

.option-input {
flex: 1;
padding: 8px 12px;
font-size: 13px;
border: 1px solid #d1d5db;
border-radius: 6px;
background: #ffffff;
color: #111827;
}

.option-input:focus {
outline: none;
border-color: #3b82f6;
box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.option-delete-btn {
display: flex;
align-items: center;
justify-content: center;
width: 36px;
height: 36px;
padding: 0;
border: 1px solid #e5e7eb;
border-radius: 6px;
background: #ffffff;
color: #6b7280;
cursor: pointer;
transition: all 0.2s ease;
flex-shrink: 0;
}

.option-delete-btn:hover:not(:disabled) {
border-color: #ef4444;
color: #ef4444;
background: #fef2f2;
}

.option-delete-btn:disabled {
opacity: 0.4;
cursor: not-allowed;
}

.option-delete-btn svg {
width: 16px;
height: 16px;
}

.add-option-btn {
display: flex;
align-items: center;
justify-content: center;
gap: 6px;
width: 100%;
padding: 8px 12px;
font-size: 13px;
font-weight: 500;
border: 1px dashed #d1d5db;
border-radius: 6px;
background: #ffffff;
color: #6b7280;
cursor: pointer;
transition: all 0.2s ease;
margin-top: 8px;
}

.add-option-btn:hover {
border-color: #3b82f6;
color: #3b82f6;
background: #eff6ff;
}

.add-option-btn svg {
width: 16px;
height: 16px;
}
</style>