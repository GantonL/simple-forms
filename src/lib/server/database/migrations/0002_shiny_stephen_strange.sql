INSERT INTO "form_template" ("name", "description", "schema")
VALUES (
  'Name and signature',
  'Simple name and signature form template',
  '{"fields": [{"label": "first_name", "type": "string"}, {"label": "last_name", "type": "string"}], "contents": [{"type": "markdown"}]}'::jsonb
);
