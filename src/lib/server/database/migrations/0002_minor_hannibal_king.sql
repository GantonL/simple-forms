INSERT INTO "form_template" ("key", "schema")
VALUES (
  'generic_consent_form',
  '{
    "version": "1.0",
    "direction": "rtl",
    "editableTextBlocks": [
      { "id": "title", "label": "titles.consent_form", "content": "content.consent_form_title" },
      { "id": "introduction", "label": "sections.introduction", "content": "content.introduction" },
      { "id": "terms", "label": "sections.terms", "content": "content.terms" },
      { "id": "confirmation", "label": "sections.confirmation", "content": "content.confirmation" },
      { "id": "admin_statement", "label": "sections.admin_statement", "content": "content.admin_statement" }
    ],
    "fields": [
      { "id": "participant_full_name", "label": "labels.full_name", "type": "text", "required": true },
      { "id": "participant_id", "label": "labels.id_number", "type": "text", "required": true },
      { "id": "participant_address", "label": "labels.address", "type": "text", "required": true },
      { "id": "participant_phone", "label": "labels.phone_number", "type": "text", "required": true },
      { "id": "participant_signature", "label": "labels.signature", "type": "signature", "required": true },
      { "id": "participant_date", "label": "labels.date", "type": "date", "required": true },
      { "id": "admin_name", "label": "labels.admin_name", "type": "text" },
      { "id": "admin_signature", "label": "labels.admin_signature", "type": "signature" },
      { "id": "admin_date", "label": "labels.admin_date", "type": "date" }
    ],
    "layout": {
      "sections": [
        ["title"],
        ["introduction"],
        ["terms"],
        ["confirmation"],
        [
          "fields:participant_full_name",
          "fields:participant_id",
          "fields:participant_address",
          "fields:participant_phone"
        ],
        ["fields:participant_signature", "fields:participant_date"],
        ["admin_statement"],
        ["fields:admin_name", "fields:admin_signature", "fields:admin_date"]
      ]
    },
    "pdfLayout": {
      "pageSize": "A4",
      "margins": { "top": 50, "right": 50, "bottom": 50, "left": 50 },
      "font": { "family": "Heebo", "size": 12 },
      "sections": [
        { "type": "text", "source": "title", "style": { "fontSize": 18, "bold": true, "align": "center", "marginBottom": 20 } },
        { "type": "text", "source": "introduction" },
        { "type": "text", "source": "terms" },
        { "type": "text", "source": "confirmation" },
        {
          "type": "fields",
          "fields": [
            { "label": "labels.full_name", "source": "participant_full_name", "x": 350, "yOffset": 0 },
            { "label": "labels.id_number", "source": "participant_id", "x": 50, "yOffset": 0 },
            { "label": "labels.address", "source": "participant_address", "x": 350, "yOffset": 40 },
            { "label": "labels.phone_number", "source": "participant_phone", "x": 50, "yOffset": 40 },
            { "label": "labels.signature", "source": "participant_signature", "x": 350, "yOffset": 80, "type": "signature" },
            { "label": "labels.date", "source": "participant_date", "x": 50, "yOffset": 80 }
          ]
        },
        {
          "type": "fields",
          "fields": [
            { "label": "labels.admin_name", "source": "admin_name", "x": 350, "yOffset": 0 },
            { "label": "labels.admin_signature", "source": "admin_signature", "x": 350, "yOffset": 40, "type": "signature" },
            { "label": "labels.admin_date", "source": "admin_date", "x": 50, "yOffset": 40 }
          ]
        }
      ]
    }
  }
'::jsonb
);
