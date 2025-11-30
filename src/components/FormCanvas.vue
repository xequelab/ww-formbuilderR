<template>
  <div class="form-canvas">
    <div class="canvas-header">
      <div class="canvas-title-section">
        <h3 class="canvas-title">Construtor de Formulários</h3>
        <p v-if="serviceName" class="service-name">{{ serviceName }}</p>
      </div>
      <div class="canvas-actions">
        <button
          class="action-btn save-btn"
          @click="$emit('save')"
          :disabled="fields.length === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Salvar
        </button>
        <button
          class="action-btn preview-btn"
          @click="$emit('preview')"
          :disabled="fields.length === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Visualizar
        </button>
        <button
          class="action-btn clear-btn"
          @click="$emit('clear')"
          :disabled="fields.length === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpar Tudo
        </button>
        <button
          class="close-popup-btn"
          @click="$emit('close')"
          title="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="canvas-content">
      <draggable
        v-model="localFields"
        group="fields"
        item-key="id"
        class="fields-container"
        :class="{ 'empty': localFields.length === 0 }"
        ghost-class="ghost"
        drag-class="drag"
        @change="handleChange"
      >
        <template #item="{ element, index }">
          <div
            class="field-item"
            :class="{ 'selected': selectedFieldId === element.id, 'locked': element.locked }"
            @click="selectField(element.id)"
          >
            <div class="field-drag-handle" :class="{ 'disabled': element.locked }">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h4m0 0V4m0 4l-4-4m16 0h-4m0 0V4m0 4l4-4M4 16h4m0 0v4m0-4l-4 4m16-4h-4m0 0v4m0-4l4 4" />
              </svg>
            </div>
            
            <div class="field-content">
              <div class="field-header">
                <div class="field-info">
                  <div class="field-icon-small" v-html="element.icon"></div>
                  <span class="field-label-text">
                    {{ element.label }}
                    <span v-if="element.required" class="required-badge">*</span>
                  </span>
                </div>
                <span class="field-type-badge">{{ element.type }}</span>
              </div>
              
              <div class="field-preview">
                <input
                  v-if="['text', 'email', 'number', 'date'].includes(element.type)"
                  :type="element.type"
                  :placeholder="element.placeholder || `Digite ${element.label.toLowerCase()}`"
                  class="preview-input"
                  disabled
                />
                <input
                  v-else-if="element.type === 'phone'"
                  type="tel"
                  :placeholder="element.placeholder || element.mask"
                  class="preview-input"
                  disabled
                />
                <textarea
                  v-else-if="element.type === 'textarea'"
                  :placeholder="element.placeholder || `Digite ${element.label.toLowerCase()}`"
                  class="preview-textarea"
                  disabled
                ></textarea>
                <select
                  v-else-if="element.type === 'select'"
                  class="preview-select"
                  disabled
                >
                  <option value="">Selecione uma opção</option>
                  <option 
                    v-for="(option, idx) in element.options" 
                    :key="idx"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <div v-else-if="element.type === 'checkbox'" class="preview-checkbox-group">
                  <div
                    v-for="(option, idx) in element.options"
                    :key="idx"
                    class="preview-checkbox"
                  >
                    <input type="checkbox" :name="`checkbox_${element.id}`" disabled />
                    <span>{{ option.label }}</span>
                  </div>
                </div>
                <div v-else-if="element.type === 'radio'" class="preview-radio-group">
                  <div
                    v-for="(option, idx) in element.options"
                    :key="idx"
                    class="preview-radio"
                  >
                    <input type="radio" :name="`radio_${element.id}`" disabled />
                    <span>{{ option.label }}</span>
                  </div>
                </div>
                <div v-else-if="element.type === 'slider'" class="preview-slider">
                  <input
                    type="range"
                    :min="element.min"
                    :max="element.max"
                    :step="element.step"
                    :value="element.defaultValue"
                    class="preview-slider-input"
                    disabled
                  />
                  <div v-if="element.showValue" class="preview-slider-value">
                    {{ element.defaultValue }}{{ element.unit }}
                  </div>
                </div>
                <div v-else-if="element.type === 'toggle'" class="preview-toggle">
                  <label class="toggle-switch">
                    <input type="checkbox" :checked="element.defaultValue" disabled />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">{{ element.defaultValue ? element.labelOn : element.labelOff }}</span>
                </div>
                <div v-else-if="element.type === 'divider'" class="preview-divider">
                  <h3 class="divider-title">{{ element.title }}</h3>
                  <p v-if="element.description" class="divider-description">{{ element.description }}</p>
                  <hr class="divider-line" />
                </div>
                <div v-else-if="element.type === 'address'" class="preview-address">
                  <div class="address-grid">
                    <input v-if="element.fields.zipCode" type="text" placeholder="CEP" class="preview-input" disabled />
                    <input v-if="element.fields.street" type="text" placeholder="Rua" class="preview-input" disabled />
                    <input v-if="element.fields.number" type="text" placeholder="Número" class="preview-input small" disabled />
                    <input v-if="element.fields.complement" type="text" placeholder="Complemento" class="preview-input" disabled />
                    <input v-if="element.fields.neighborhood" type="text" placeholder="Bairro" class="preview-input" disabled />
                    <input v-if="element.fields.city" type="text" placeholder="Cidade" class="preview-input" disabled />
                    <input v-if="element.fields.state" type="text" placeholder="Estado" class="preview-input small" disabled />
                  </div>
                </div>
                <div v-else-if="element.type === 'link'" class="preview-link">
                  <a :href="element.url || '#'" class="link-element" target="_blank">
                    {{ element.linkText }}
                  </a>
                </div>
                <div v-else-if="element.type === 'consent'" class="preview-consent">
                  <label class="consent-label">
                    <input type="checkbox" :required="element.required" disabled />
                    <span>{{ element.consentText }} <a v-if="element.linkUrl" :href="element.linkUrl" target="_blank">{{ element.linkText }}</a></span>
                  </label>
                </div>
              </div>
              
              <p v-if="element.helpText" class="field-help-text">{{ element.helpText }}</p>
            </div>
            
            <div v-if="!element.locked" class="field-actions">
              <button
                class="field-action-btn duplicate-btn"
                @click.stop="duplicateField(index)"
                title="Duplicar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                class="field-action-btn delete-btn"
                @click.stop="deleteField(index)"
                title="Excluir"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div v-else class="field-locked-indicator" title="Este campo é obrigatório e não pode ser removido">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </template>
        
        <template #footer>
          <div v-if="localFields.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Arraste campos da barra lateral para começar a construir seu formulário</p>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'FormCanvas',
  components: {
    draggable
  },
  props: {
    fields: {
      type: Array,
      required: true
    },
    selectedFieldId: {
      type: String,
      default: null
    },
    serviceName: {
      type: String,
      default: ''
    }
  },
  emits: ['update:fields', 'select-field', 'save', 'preview', 'clear', 'close'],
  setup(props, { emit }) {
    const localFields = computed({
      get: () => props.fields,
      set: (value) => emit('update:fields', value)
    });

    const selectField = (fieldId) => {
      emit('select-field', fieldId);
    };

    const duplicateField = (index) => {
      const field = localFields.value[index];
      const duplicatedField = {
        ...JSON.parse(JSON.stringify(field)),
        id: uuidv4(),
        fieldId: `${field.fieldId}_copy_${Date.now()}`
      };
      
      const newFields = [...localFields.value];
      newFields.splice(index + 1, 0, duplicatedField);
      emit('update:fields', newFields);
      emit('select-field', duplicatedField.id);
    };

    const deleteField = (index) => {
      const newFields = [...localFields.value];
      const deletedFieldId = newFields[index].id;
      newFields.splice(index, 1);
      emit('update:fields', newFields);
      
      if (props.selectedFieldId === deletedFieldId) {
        emit('select-field', null);
      }
    };

    const handleChange = (evt) => {
      if (evt.added) {
        emit('select-field', evt.added.element.id);
      }
    };

    return {
      localFields,
      selectField,
      duplicateField,
      deleteField,
      handleChange
    };
  }
};
</script>

<style scoped>
.form-canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.canvas-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.canvas-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.service-name {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.canvas-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.save-btn:hover:not(:disabled) {
  border-color: #10b981;
  color: #10b981;
  background: #f0fdf4;
}

.preview-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.clear-btn:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
}

.close-popup-btn {
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
  margin-left: 8px;
}

.close-popup-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.close-popup-btn svg {
  width: 20px;
  height: 20px;
}

.canvas-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.fields-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fields-container.empty {
  justify-content: center;
  align-items: center;
}

.field-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.field-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.field-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-drag-handle {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
  color: #9ca3af;
  cursor: grab;
}

.field-drag-handle.disabled {
  cursor: not-allowed;
  opacity: 0.3;
  pointer-events: none;
}

.field-drag-handle:active {
  cursor: grabbing;
}

.field-drag-handle svg {
  width: 16px;
  height: 16px;
}

.field-content {
  flex: 1;
  min-width: 0;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.field-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-icon-small {
  width: 18px;
  height: 18px;
  color: #3b82f6;
}

.field-icon-small svg {
  width: 100%;
  height: 100%;
}

.field-label-text {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.required-badge {
  color: #ef4444;
  margin-left: 2px;
}

.field-type-badge {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 4px;
}

.field-preview {
  margin-bottom: 8px;
}

.preview-input,
.preview-textarea,
.preview-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  color: #6b7280;
}

.preview-textarea {
  min-height: 80px;
  resize: vertical;
}

.preview-checkbox,
.preview-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.preview-checkbox-group,
.preview-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-help-text {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.field-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.field-action-btn:hover {
  background: #f9fafb;
}

.field-action-btn svg {
  width: 16px;
  height: 16px;
}

.duplicate-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.delete-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  max-width: 300px;
}

.ghost {
  opacity: 0.5;
  background: #dbeafe;
  border: 2px dashed #3b82f6;
}

.drag {
  opacity: 0.8;
  transform: rotate(2deg);
}

/* New field types styles */
.preview-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-slider-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #d1d5db;
  outline: none;
  cursor: pointer;
}

.preview-slider-value {
  font-size: 14px;
  color: #374151;
  text-align: center;
  font-weight: 500;
}

.preview-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
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

.preview-divider {
  margin: 16px 0;
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
  margin: 0;
}

.preview-address {
  width: 100%;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.address-grid .small {
  grid-column: span 1;
  max-width: 120px;
}

.preview-link {
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

.preview-consent {
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

.field-locked-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #d97706;
  background: #fef3c7;
  border-radius: 6px;
  opacity: 0.6;
}

.field-locked-indicator svg {
  width: 16px;
  height: 16px;
}

.field-item.locked {
  border-color: #fbbf24;
  background: #fefce8;
}

.field-item.locked:hover {
  border-color: #fbbf24;
  box-shadow: 0 1px 3px rgba(251, 191, 36, 0.1);
}

.field-item.locked.selected {
  border-color: #f59e0b;
  background: #fef9f3;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.08);
}
</style>