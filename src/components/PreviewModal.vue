<template>
<div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
<div class="modal-container">
<div class="modal-header">
<h3 class="modal-title">Visualização do Formulário</h3>
<button class="modal-close-btn" @click="$emit('close')">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg>
</button>
</div>

<div class="modal-content">
<form class="preview-form" @submit.prevent>
<div 
v-for="field in fields"
:key="field.id"
class="form-field"
>
<label class="form-label">
{{ field.label }}
<span v-if="field.required" class="required-star">*</span>
</label>

<input
v-if="['text', 'email', 'number', 'date', 'phone'].includes(field.type)"
:type="field.type === 'phone' ? 'tel' : field.type"
:placeholder="field.placeholder || (field.type === 'phone' ? field.mask : '')"
:required="field.required"
:min="field.min"
:max="field.max"
:step="field.step"
:maxlength="field.maxLength"
class="form-input"
/>

<textarea 
v-else-if="field.type === 'textarea'"
:placeholder="field.placeholder"
:required="field.required"
:maxlength="field.maxLength"
class="form-textarea"
rows="4"
></textarea>

<select
v-else-if="field.type === 'select'"
:required="field.required"
class="form-select"
>
<option value="">Selecione uma opção</option>
<option
v-for="(option, idx) in field.options"
:key="idx"
:value="option.value"
>
{{ option.label }}
</option>
</select>

<div v-else-if="field.type === 'checkbox'" class="form-checkbox-wrapper">
<label
v-for="(option, idx) in field.options"
:key="idx"
class="form-checkbox-label"
>
<input
type="checkbox"
:name="`checkbox_${field.id}`"
:value="option.value"
class="form-checkbox"
/>
<span>{{ option.label }}</span>
</label>
</div>

<div v-else-if="field.type === 'radio'" class="form-radio-group">
<label
v-for="(option, idx) in field.options"
:key="idx"
class="form-radio-label"
>
<input
type="radio"
:name="`preview_${field.id}`"
:value="option.value"
:required="field.required"
class="form-radio"
/>
<span>{{ option.label }}</span>
</label>
</div>

<div v-else-if="field.type === 'slider'" class="form-slider">
<input
type="range"
:min="field.min"
:max="field.max"
:step="field.step"
:value="field.defaultValue"
class="form-slider-input"
/>
<div v-if="field.showValue" class="form-slider-value">
{{ field.defaultValue }}{{ field.unit }}
</div>
</div>

<div v-else-if="field.type === 'toggle'" class="form-toggle">
<label class="toggle-switch">
<input type="checkbox" :checked="field.defaultValue" />
<span class="toggle-slider"></span>
</label>
<span class="toggle-label">{{ field.defaultValue ? field.labelOn : field.labelOff }}</span>
</div>

<div v-else-if="field.type === 'divider'" class="form-divider">
<h3 class="divider-title">{{ field.title }}</h3>
<p v-if="field.description" class="divider-description">{{ field.description }}</p>
<hr class="divider-line" />
</div>

<div v-else-if="field.type === 'address'" class="form-address">
<div class="address-grid">
<input v-if="field.fields.zipCode" type="text" placeholder="CEP" class="form-input" />
<input v-if="field.fields.street" type="text" placeholder="Rua" class="form-input" />
<input v-if="field.fields.number" type="text" placeholder="Número" class="form-input small" />
<input v-if="field.fields.complement" type="text" placeholder="Complemento" class="form-input" />
<input v-if="field.fields.neighborhood" type="text" placeholder="Bairro" class="form-input" />
<input v-if="field.fields.city" type="text" placeholder="Cidade" class="form-input" />
<input v-if="field.fields.state" type="text" placeholder="Estado" class="form-input small" />
</div>
</div>

<div v-else-if="field.type === 'link'" class="form-link">
<a :href="field.url || '#'" class="link-element" :target="field.openNewTab ? '_blank' : '_self'">
{{ field.linkText }}
</a>
</div>

<div v-else-if="field.type === 'consent'" class="form-consent">
<label class="consent-label">
<input type="checkbox" :required="field.required" class="form-checkbox" />
<span>{{ field.consentText }} <a v-if="field.linkUrl" :href="field.linkUrl" target="_blank">{{ field.linkText }}</a></span>
</label>
</div>

<p v-if="field.helpText && field.type !== 'divider'" class="form-help-text">{{ field.helpText }}</p>
</div>

<div class="form-actions">
<button type="submit" class="submit-btn">Enviar Formulário</button>
<button type="button" class="cancel-btn" @click="$emit('close')">Fechar Visualização</button>
</div>
</form>
</div>
</div>
</div>
</template>

<script>
export default {
name: 'PreviewModal',
props: {
isOpen: {
type: Boolean,
required: true
},
fields: {
type: Array,
required: true
}
},
emits: ['close']
};
</script>

<style scoped>
.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
padding: 20px;
}

.modal-container {
width: 100%;
max-width: 600px;
max-height: 90vh;
background: #ffffff;
border-radius: 12px;
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
display: flex;
flex-direction: column;
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
padding: 20px 24px;
border-bottom: 1px solid #e5e7eb;
}

.modal-title {
font-size: 18px;
font-weight: 600;
color: #111827;
margin: 0;
}

.modal-close-btn {
display: flex;
align-items: center;
justify-content: center;
width: 32px;
height: 32px;
padding: 0;
border: none;
border-radius: 6px;
background: transparent;
color: #6b7280;
cursor: pointer;
transition: all 0.2s ease;
}

.modal-close-btn:hover {
background: #f3f4f6;
color: #111827;
}

.modal-close-btn svg {
width: 20px;
height: 20px;
}

.modal-content {
flex: 1;
overflow-y: auto;
padding: 24px;
}

.preview-form {
display: flex;
flex-direction: column;
gap: 20px;
}

.form-field {
display: flex;
flex-direction: column;
gap: 8px;
}

.form-label {
font-size: 14px;
font-weight: 500;
color: #374151;
}

.required-star {
color: #ef4444;
margin-left: 2px;
}

.form-input,
.form-textarea,
.form-select {
width: 100%;
padding: 10px 14px;
font-size: 14px;
border: 1px solid #d1d5db;
border-radius: 6px;
background: #ffffff;
color: #111827;
transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
outline: none;
border-color: #3b82f6;
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
resize: vertical;
font-family: inherit;
}

.form-checkbox-wrapper {
padding: 8px 0;
display: flex;
flex-direction: column;
gap: 10px;
}

.form-checkbox-label,
.form-radio-label {
display: flex;
align-items: center;
gap: 8px;
font-size: 14px;
color: #374151;
cursor: pointer;
}

.form-checkbox,
.form-radio {
width: 16px;
height: 16px;
cursor: pointer;
}

.form-radio-group {
display: flex;
flex-direction: column;
gap: 10px;
padding: 8px 0;
}

.form-help-text {
font-size: 13px;
color: #6b7280;
margin: 0;
}

.form-actions {
display: flex;
gap: 12px;
padding-top: 8px;
}

.submit-btn,
.cancel-btn {
flex: 1;
padding: 10px 16px;
font-size: 14px;
font-weight: 500;
border: none;
border-radius: 6px;
cursor: pointer;
transition: all 0.2s ease;
}

.submit-btn {
background: #3b82f6;
color: #ffffff;
}

.submit-btn:hover {
background: #2563eb;
}

.cancel-btn {
background: #f3f4f6;
color: #374151;
}

.cancel-btn:hover {
background: #e5e7eb;
}

/* New field types styles */
.form-slider {
display: flex;
flex-direction: column;
gap: 8px;
padding: 8px 0;
}

.form-slider-input {
width: 100%;
height: 6px;
border-radius: 3px;
background: #d1d5db;
outline: none;
cursor: pointer;
}

.form-slider-value {
font-size: 14px;
color: #374151;
text-align: center;
font-weight: 500;
}

.form-toggle {
display: flex;
align-items: center;
gap: 12px;
padding: 8px 0;
}

.toggle-switch {
position: relative;
display: inline-block;
width: 48px;
height: 24px;
}

.toggle-switch input {
opacity: 0;
width: 0;
height: 0;
}

.toggle-slider {
position: absolute;
cursor: pointer;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: #d1d5db;
transition: 0.4s;
border-radius: 24px;
}

.toggle-slider:before {
position: absolute;
content: "";
height: 18px;
width: 18px;
left: 3px;
bottom: 3px;
background-color: white;
transition: 0.4s;
border-radius: 50%;
}

input:checked + .toggle-slider {
background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
transform: translateX(24px);
}

.toggle-label {
font-size: 14px;
color: #374151;
}

.form-divider {
margin: 16px 0;
padding: 0;
}

.divider-title {
font-size: 16px;
font-weight: 600;
color: #111827;
margin: 0 0 4px 0;
}

.divider-description {
font-size: 13px;
color: #6b7280;
margin: 0 0 8px 0;
}

.divider-line {
border: none;
border-top: 2px solid #e5e7eb;
margin: 8px 0 0 0;
}

.form-address {
width: 100%;
}

.address-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
gap: 12px;
}

.address-grid .small {
grid-column: span 1;
max-width: 120px;
}

.form-link {
padding: 8px 0;
}

.link-element {
color: #3b82f6;
text-decoration: underline;
font-size: 14px;
cursor: pointer;
}

.link-element:hover {
color: #2563eb;
}

.form-consent {
padding: 8px 0;
}

.consent-label {
display: flex;
align-items: flex-start;
gap: 8px;
font-size: 14px;
color: #374151;
cursor: pointer;
}

.consent-label input[type="checkbox"] {
margin-top: 2px;
flex-shrink: 0;
}

.consent-label a {
color: #3b82f6;
text-decoration: underline;
}

.consent-label a:hover {
color: #2563eb;
}
</style>