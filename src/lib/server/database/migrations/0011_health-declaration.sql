-- Custom SQL migration file, put your code below! --
INSERT INTO "form_template" ("key", "schema")
VALUES (
  'health_declaration_form',
  '{
    "version": "1.0",
    "direction": "rtl",
    "editableTextBlocks": [
      { "id": "title", "label": "templates.titles.health_declaration_form", "content": "templates.content.health_declaration_form_title" },
      { "id": "declaration_intro", "label": "templates.sections.declaration_intro", "content": "templates.content.declaration_intro" },
      { "id": "health_statement", "label": "templates.sections.health_statement", "content": "templates.content.health_statement" }
    ],
    "fields": [
      { "id": "participant_full_name", "label": "templates.labels.full_name", "type": "text", "required": true },
      { "id": "participant_id", "label": "templates.labels.id_number", "type": "text", "required": true },
      { "id": "participant_dob", "label": "templates.labels.date_of_birth", "type": "date", "required": true },
      { "id": "participant_phone", "label": "templates.labels.phone_number", "type": "text", "required": true },
      { "id": "health_conditions", "label": "templates.labels.health_conditions", "type": "text" },
      { "id": "participant_signature", "label": "templates.labels.signature", "type": "signature", "required": true },
      { "id": "participant_date", "label": "templates.labels.date", "type": "date", "required": true }
    ],
    "layout": {
      "sections": [
        ["title"],
        ["declaration_intro"],
        [
          "fields:participant_full_name",
          "fields:participant_id",
          "fields:participant_dob",
          "fields:participant_phone"
        ],
        ["health_statement"],
        ["fields:health_conditions"],
        ["fields:participant_signature", "fields:participant_date"]
      ]
    }
  }
'::jsonb
);
