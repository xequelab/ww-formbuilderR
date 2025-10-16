<template>
  <div class="field-palette">
    <h3 class="palette-title">Tipos de Campos</h3>
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
        label: 'Resposta Curta',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>'
      },
      {
        type: 'textarea',
        label: 'Área de Texto',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>'
      },
      {
        type: 'number',
        label: 'Número',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>'
      },
      {
        type: 'email',
        label: 'E-mail',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
      },
      {
        type: 'select',
        label: 'Seleção',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>'
      },
      {
        type: 'checkbox',
        label: 'Caixa de Seleção',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
      },
      {
        type: 'radio',
        label: 'Múltipla Escolha',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>'
      },
      {
        type: 'date',
        label: 'Data',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
      },
      {
        type: 'phone',
        label: 'Telefone',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>'
      },
      {
        type: 'slider',
        label: 'Slider',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>'
      },
      {
        type: 'toggle',
        label: 'Toggle',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>'
      },
      {
        type: 'divider',
        label: 'Separador',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>'
      },
      {
        type: 'address',
        label: 'Endereço',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
      },
      {
        type: 'link',
        label: 'Link',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>'
      },
      {
        type: 'consent',
        label: 'Termo de Consentimento',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
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

      if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
        newField.options = [
          { label: 'Opção 1', value: 'opcao_1' },
          { label: 'Opção 2', value: 'opcao_2' }
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

      if (field.type === 'phone') {
        newField.country = 'BR';
        newField.mask = '(99) 99999-9999';
      }

      if (field.type === 'slider') {
        newField.min = 0;
        newField.max = 100;
        newField.step = 1;
        newField.defaultValue = 50;
        newField.showValue = true;
        newField.unit = '';
      }

      if (field.type === 'toggle') {
        newField.defaultValue = false;
        newField.labelOn = 'Sim';
        newField.labelOff = 'Não';
      }

      if (field.type === 'divider') {
        newField.title = 'Seção';
        newField.description = '';
      }

      if (field.type === 'address') {
        newField.country = 'BR';
        newField.autocomplete = true;
        newField.fields = {
          street: true,
          number: true,
          complement: true,
          neighborhood: true,
          city: true,
          state: true,
          zipCode: true
        };
      }

      if (field.type === 'link') {
        newField.url = '';
        newField.linkText = 'Clique aqui';
        newField.openNewTab = true;
      }

      if (field.type === 'consent') {
        newField.consentText = 'Li e aceito os termos e condições';
        newField.linkUrl = '';
        newField.linkText = 'termos e condições';
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