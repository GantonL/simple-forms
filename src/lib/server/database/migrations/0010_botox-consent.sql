-- Custom SQL migration file, put your code below! --
INSERT INTO "form_template" ("key", "schema")
VALUES (
  'botox_consent_form',
  '{
    "version": "1.0",
    "direction": "rtl",
    "editableTextBlocks": [
      { "id": "title", "label": "common.title", "content": "common.title" },
      { "id": "introduction", "label": "templates.sections.introduction", "content": "templates.content.introduction" },
      { "id": "content", "label": "templates.sections.content", "content": "templates.content.content" },
      { "id": "doctor_statement", "label": "templates.sections.doctor_statement", "content": "templates.content.doctor_statement" }
    ],
    "fields": [
      { "id": "first_name", "label": "templates.labels.first_name", "type": "text", "required": true },
      { "id": "last_name", "label": "templates.labels.last_name", "type": "text", "required": true },
      { "id": "personal_id", "label": "templates.labels.id_number", "type": "text", "required": true },
      { "id": "injection_areas", "label": "templates.labels.injection_areas", "type": "text", "required": true },
      { "id": "signature", "label": "templates.labels.signature", "type": "signature", "required": true },
      { "id": "date", "label": "templates.labels.date", "type": "date", "required": true },
      { "id": "patient_signature_name", "label": "templates.labels.full_name", "type": "text", "required": true },
      { "id": "doctor_name", "label": "templates.labels.doctor_name", "type": "text", "disabled": true },
      { "id": "doctor_signature", "label": "templates.labels.signature", "type": "signature", "disabled": true },
      { "id": "doctor_date", "label": "templates.labels.date", "type": "date", "disabled": true }
    ],
    "layout": {
      "sections": [
        ["title"],
        ["introduction"],
        [
          "fields:first_name",
          "fields:last_name",
          "fields:personal_id"
        ],
        ["fields:injection_areas"],
        ["content"],
        ["fields:date", "fields:patient_signature_name", "fields:signature"],
        ["doctor_statement"],
        ["fields:doctor_date", "fields:doctor_name", "fields:doctor_signature"]
      ]
    }
  }'::jsonb
);
