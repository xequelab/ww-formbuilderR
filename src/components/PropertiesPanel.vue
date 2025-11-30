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
      <div v-if="localField.locked" class="locked-field-notice">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div class="locked-field-text">
          <strong>Campo Bloqueado</strong>
          <p>Este campo é obrigatório e não pode ser removido do formulário.</p>
        </div>
      </div>

      <div class="property-group">
        <label class="property-label">Rótulo</label>
        <input
          v-model="localField.label"
          type="text"
          class="property-input"
          :class="{ 'locked-input': localField.locked }"
          placeholder="Rótulo do campo"
          :disabled="localField.locked"
          @input="updateField"
        />
      </div>

      <div class="property-group">
        <label class="property-label">Placeholder</label>
        <input
          v-model="localField.placeholder"
          type="text"
          class="property-input"
          :class="{ 'locked-input': localField.locked }"
          placeholder="Digite o texto de exemplo"
          :disabled="localField.locked"
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
<p class="property-hint">Define o intervalo entre valores (ex: 1 = 1,2,3... | 0.5 = 0.5,1,1.5...)</p>
</div>
</template>

<!-- Text/Textarea specific properties -->
<template v-if="['text', 'textarea'].includes(localField.type)">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações de Texto</h4>

<div class="property-group">
<label class="property-label">Comprimento Máximo (caracteres)</label>
<input
v-model.number="localField.maxLength"
type="number"
class="property-input"
placeholder="Sem limite"
@input="updateField"
/>
</div>
</template>

<!-- Select/Radio/Checkbox specific properties -->
<template v-if="['select', 'radio', 'checkbox'].includes(localField.type)">
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
class="option-input-full"
placeholder="Digite o texto da opção"
@input="updateOptionLabel(index, $event)"
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

<!-- Phone specific properties -->
<template v-if="localField.type === 'phone'">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações de Telefone</h4>

<div class="property-group">
<label class="property-label">País</label>
<select v-model="localField.country" class="property-input" @change="updateField">
<option value="BR">Brasil</option>
<option value="US">Estados Unidos</option>
<option value="PT">Portugal</option>
</select>
</div>

<div class="property-group">
<label class="property-label">Máscara</label>
<input
v-model="localField.mask"
type="text"
class="property-input"
placeholder="(99) 99999-9999"
@input="updateField"
/>
<p class="property-hint">Use 9 para dígitos. Ex: (99) 99999-9999</p>
</div>
</template>

<!-- Slider specific properties -->
<template v-if="localField.type === 'slider'">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações do Slider</h4>

<div class="property-group">
<label class="property-label">Valor Mínimo</label>
<input
v-model.number="localField.min"
type="number"
class="property-input"
@input="updateField"
/>
</div>

<div class="property-group">
<label class="property-label">Valor Máximo</label>
<input
v-model.number="localField.max"
type="number"
class="property-input"
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

<div class="property-group">
<label class="property-label">Valor Padrão</label>
<input
v-model.number="localField.defaultValue"
type="number"
class="property-input"
@input="updateField"
/>
</div>

<div class="property-group">
<label class="property-label">Unidade</label>
<input
v-model="localField.unit"
type="text"
class="property-input"
placeholder="kg, km, %, etc"
@input="updateField"
/>
</div>

<div class="property-group checkbox-group">
<label class="checkbox-label">
<input
v-model="localField.showValue"
type="checkbox"
@change="updateField"
/>
<span>Mostrar valor atual</span>
</label>
</div>
</template>

<!-- Toggle specific properties -->
<template v-if="localField.type === 'toggle'">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações do Toggle</h4>

<div class="property-group">
<label class="property-label">Texto "Ligado"</label>
<input
v-model="localField.labelOn"
type="text"
class="property-input"
placeholder="Sim"
@input="updateField"
/>
</div>

<div class="property-group">
<label class="property-label">Texto "Desligado"</label>
<input
v-model="localField.labelOff"
type="text"
class="property-input"
placeholder="Não"
@input="updateField"
/>
</div>

<div class="property-group checkbox-group">
<label class="checkbox-label">
<input
v-model="localField.defaultValue"
type="checkbox"
@change="updateField"
/>
<span>Ligado por padrão</span>
</label>
</div>
</template>

<!-- Divider specific properties -->
<template v-if="localField.type === 'divider'">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações do Separador</h4>

<div class="property-group">
<label class="property-label">Título</label>
<input
v-model="localField.title"
type="text"
class="property-input"
placeholder="Título da seção"
@input="updateField"
/>
</div>

<div class="property-group">
<label class="property-label">Descrição</label>
<textarea
v-model="localField.description"
class="property-textarea"
placeholder="Descrição opcional"
rows="2"
@input="updateField"
></textarea>
</div>
</template>

<!-- Address specific properties -->
<template v-if="localField.type === 'address'">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações de Endereço</h4>

<div class="property-group">
<label class="property-label">País</label>
<select v-model="localField.country" class="property-input" @change="updateField">
<option value="BR">Brasil</option>
<option value="US">Estados Unidos</option>
<option value="PT">Portugal</option>
</select>
</div>

<div class="property-group checkbox-group">
<label class="checkbox-label">
<input
v-model="localField.autocomplete"
type="checkbox"
@change="updateField"
/>
<span>Habilitar autocomplete</span>
</label>
</div>

<div class="property-divider"></div>
<h4 class="property-section-title">Campos a Exibir</h4>

<div class="property-group checkbox-group">
<label class="checkbox-label">
<input v-model="localField.fields.street" type="checkbox" @change="updateField" />
<span>Rua/Logradouro</span>
</label>
<label class="checkbox-label">
<input v-model="localField.fields.number" type="checkbox" @change="updateField" />
<span>Número</span>
</label>
<label class="checkbox-label">
<input v-model="localField.fields.complement" type="checkbox" @change="updateField" />
<span>Complemento</span>
</label>
<label class="checkbox-label">
<input v-model="localField.fields.neighborhood" type="checkbox" @change="updateField" />
<span>Bairro</span>
</label>
<label class="checkbox-label">
<input v-model="localField.fields.city" type="checkbox" @change="updateField" />
<span>Cidade</span>
</label>
<label class="checkbox-label">
<input v-model="localField.fields.state" type="checkbox" @change="updateField" />
<span>Estado</span>
</label>
<label class="checkbox-label">
<input v-model="localField.fields.zipCode" type="checkbox" @change="updateField" />
<span>CEP</span>
</label>
</div>
</template>

<!-- Link specific properties -->
<template v-if="localField.type === 'link'">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações do Link</h4>

<div class="property-group">
<label class="property-label">URL</label>
<input
v-model="localField.url"
type="url"
class="property-input"
placeholder="https://exemplo.com"
@input="updateField"
/>
</div>

<div class="property-group">
<label class="property-label">Texto do Link</label>
<input
v-model="localField.linkText"
type="text"
class="property-input"
placeholder="Clique aqui"
@input="updateField"
/>
</div>

<div class="property-group checkbox-group">
<label class="checkbox-label">
<input
v-model="localField.openNewTab"
type="checkbox"
@change="updateField"
/>
<span>Abrir em nova aba</span>
</label>
</div>
</template>

<!-- Consent specific properties -->
<template v-if="localField.type === 'consent'">
<div class="property-divider"></div>
<h4 class="property-section-title">Configurações do Termo</h4>

<div class="property-group">
<label class="property-label">Texto do Consentimento</label>
<textarea
v-model="localField.consentText"
class="property-textarea"
placeholder="Li e aceito os termos e condições"
rows="3"
@input="updateField"
></textarea>
</div>

<div class="property-group">
<label class="property-label">URL dos Termos</label>
<input
v-model="localField.linkUrl"
type="url"
class="property-input"
placeholder="https://exemplo.com/termos"
@input="updateField"
/>
</div>

<div class="property-group">
<label class="property-label">Texto do Link</label>
<input
v-model="localField.linkText"
type="text"
class="property-input"
placeholder="termos e condições"
@input="updateField"
/>
<p class="property-hint">Esse texto aparecerá como link clicável dentro do consentimento</p>
</div>
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

const generateValueFromLabel = (label) => {
// Remove acentos e caracteres especiais, converte para minúsculas e substitui espaços por _
return label
.normalize('NFD')
.replace(/[\u0300-\u036f]/g, '')
.toLowerCase()
.replace(/[^a-z0-9\s]/g, '')
.trim()
.replace(/\s+/g, '_');
};

const updateOptionLabel = (index, event) => {
if (localField.value && localField.value.options && localField.value.options[index]) {
const newLabel = event.target.value;
localField.value.options[index].label = newLabel;
localField.value.options[index].value = generateValueFromLabel(newLabel);
updateField();
}
};

const addOption = () => {
if (localField.value && localField.value.options) {
const optionNumber = localField.value.options.length + 1;
const label = `Opção ${optionNumber}`;
localField.value.options.push({
label: label,
value: generateValueFromLabel(label)
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
updateOptionLabel,
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

.option-input-full {
width: 100%;
padding: 8px 12px;
font-size: 13px;
border: 1px solid #d1d5db;
border-radius: 6px;
background: #ffffff;
color: #111827;
}

.option-input-full:focus {
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

.locked-field-notice {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fef9f3;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  margin-bottom: 20px;
}

.locked-field-notice svg {
  width: 24px;
  height: 24px;
  color: #f59e0b;
  flex-shrink: 0;
}

.locked-field-text {
  flex: 1;
}

.locked-field-text strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 4px;
}

.locked-field-text p {
  font-size: 12px;
  color: #78350f;
  margin: 0;
  line-height: 1.4;
}

.property-input.locked-input {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>