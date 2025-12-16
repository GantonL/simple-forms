-- Custom SQL migration file, put your code below! --
INSERT INTO "form_template" ("key", "schema")
VALUES (
  'simple_research_consent_form',
  '{
    "version": "1.0",
    "direction": "rtl",
    "editableTextBlocks": [
      { "id": "title", "label": "common.title", "content": "common.title" },
      { "id": "content", "label": "templates.sections.content", "content": "templates.content.content" },
      { "id": "researcher_statement", "label": "templates.sections.researcher_statement", "content": "templates.content.researcher_statement" }
    ],
    "fields": [
      { "id": "participant_full_name", "label": "templates.labels.full_name", "type": "text", "required": true },
      { "id": "participant_id", "label": "templates.labels.id_number", "type": "text", "required": true },
      { "id": "participant_address", "label": "templates.labels.address", "type": "text", "required": true },
      { "id": "participant_phone", "label": "templates.labels.phone_number", "type": "text", "required": true },
      { "id": "participant_signature", "label": "templates.labels.signature", "type": "signature", "required": true },
      { "id": "participant_date", "label": "templates.labels.date", "type": "date", "required": true },
      { "id": "researcher_name", "label": "templates.labels.researcher_name", "type": "text", "disabled": true },
      { "id": "researcher_signature", "label": "templates.labels.researcher_signature", "type": "signature", "disabled": true },
      { "id": "researcher_date", "label": "templates.labels.researcher_date", "type": "date", "disabled": true }
    ],
    "layout": {
      "sections": [
        ["title"],
        [
          "fields:participant_full_name",
          "fields:participant_id",
          "fields:participant_address",
          "fields:participant_phone"
        ],
        ["content"],
        ["fields:participant_signature", "fields:participant_date"],
        ["researcher_statement"],
        ["fields:researcher_name", "fields:researcher_signature", "fields:researcher_date"]
      ]
    },
    "pdfLayout": {
      "pageSize": "A4",
      "margins": { "top": 50, "right": 50, "bottom": 50, "left": 50 },
      "font": { "family": "Heebo", "size": 12 },
      "sections": [
        { "type": "text", "source": "title", "style": { "fontSize": 18, "bold": true, "align": "center", "marginBottom": 20 } },
        {
          "type": "fields",
          "fields": [
            { "label": "templates.labels.full_name", "source": "participant_full_name", "x": 350, "yOffset": 0 },
            { "label": "templates.labels.id_number", "source": "participant_id", "x": 50, "yOffset": 0 },
            { "label": "templates.labels.address", "source": "participant_address", "x": 350, "yOffset": 40 },
            { "label": "templates.labels.phone_number", "source": "participant_phone", "x": 50, "yOffset": 40 },
            { "label": "templates.labels.signature", "source": "participant_signature", "x": 350, "yOffset": 80, "type": "signature" },
            { "label": "templates.labels.date", "source": "participant_date", "x": 50, "yOffset": 80 }
          ]
        },
        { "type": "text", "source": "content" },
        { "type": "text", "source": "researcher_statement" },
        {
          "type": "fields",
          "fields": [
            { "label": "templates.labels.researcher_name", "source": "researcher_name", "x": 350, "yOffset": 0 },
            { "label": "templates.labels.researcher_signature", "source": "researcher_signature", "x": 350, "yOffset": 40, "type": "signature" },
            { "label": "templates.labels.researcher_date", "source": "researcher_date", "x": 50, "yOffset": 40 }
          ]
        }
      ]
    }
  }'::jsonb
);
