// ✅ Checks only missing required fields
export const validateFields = (fields, body) => {
    const missing = fields.filter(f => !body[f]);
    return missing.length > 0 ? `Missing fields: ${missing.join(", ")}` : null;
};  
  // ✅ Checks if there are extra fields (security)
export const validateAllowedFields = (allowedFields, body) => {
    const extra = Object.keys(body).filter(key => !allowedFields.includes(key));
    return extra.length > 0 ? `Unexpected fields: ${extra.join(", ")}` : null;
};  