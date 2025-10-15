<template>
  <div class="field-palette">
    <h3 class="palette-title">Field Types</h3>
    <div class="palette-items">
      <draggable
        :list="fieldTypes"
        :group="{ name: 'fields', pull: 'clone', put: false }"
        :clone="cloneField"
        :sort="false"
        item-key="type"
        class="draggable-list"
      >
        <template #item="{ element }">
          <div class="field-type-card">
            <div class="field-icon" v-html="element.icon"></div>
            <span class="field-label">{{ element.label }}</span>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'FieldPalette',
  components: {
    draggable
  },
  setup() {
    const fieldTypes = ref([
      {
        type: 'text',
        label: 'Text Input',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>'
      },
      {
        type: 'textarea',
        label: 'Textarea',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>'
      },
      {
        type: 'number',
        label: 'Number',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>'
      },
      {
        type: 'email',
        label: 'Email',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
      },
      {
        type: 'select',
        label: 'Select',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>'
      },
      {
        type: 'checkbox',
        label: 'Checkbox',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
      },
      {
        type: 'radio',
        label: 'Radio',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>'
      },
      {
        type: 'date',
        label: 'Date',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
      }
    ]);

    const cloneField = (field) => {
      const newField = {
        id: uuidv4(),
        type: field.type,
        label: field.label,
        fieldId: `field_${Date.now()}`,
        placeholder: '',
        required: false,
        helpText: '',
        icon: field.icon
      };

      if (field.type === 'select' || field.type === 'radio') {
        newField.options = [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' }
        ];
      }

      if (field.type === 'number') {
        newField.min = null;
        newField.max = null;
        newField.step = 1;
      }

      if (field.type === 'text' || field.type === 'textarea') {
        newField.maxLength = null;
      }

      return newField;
    };

    return {
      fieldTypes,
      cloneField
    };
  }
};
</script>

<style scoped>
.field-palette {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

.palette-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  padding: 16px;
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.palette-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-type-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

.field-type-card:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.field-type-card:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.field-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
}

.field-icon svg {
  width: 100%;
  height: 100%;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}
</style>