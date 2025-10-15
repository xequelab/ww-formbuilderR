<template>
  <div class="form-canvas">
    <div class="canvas-header">
      <h3 class="canvas-title">Construtor de Formulários</h3>
      <div class="canvas-actions">
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
            :class="{ 'selected': selectedFieldId === element.id }"
            @click="selectField(element.id)"
          >
            <div class="field-drag-handle">
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
              </div>
              
              <p v-if="element.helpText" class="field-help-text">{{ element.helpText }}</p>
            </div>
            
            <div class="field-actions">
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
    }
  },
  emits: ['update:fields', 'select-field', 'preview', 'clear'],
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

.canvas-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
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

.preview-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.clear-btn:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
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
</style>