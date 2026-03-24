/**
 * Student ID Helper
 * Utility functions for handling student ID and classroom ID conversions
 */

/**
 * Normalizes student ID to string format
 * Handles both _id (ObjectId) and id (string) formats
 * @param {Object|string} student - Student object or ID
 * @returns {string|null} - Normalized student ID as string
 */
export function normalizeStudentId(student) {
  if (!student) return null;
  
  let studentId = student._id || student.id;
  
  if (studentId && typeof studentId === 'object' && studentId.toString) {
    studentId = studentId.toString();
  }
  
  return studentId || null;
}

/**
 * Normalizes classroom ID to string format
 * Handles both ObjectId and string formats, including populated objects
 * @param {Object|string} classroomId - Classroom ID (can be ObjectId, string, or populated object)
 * @returns {string|null} - Normalized classroom ID as string
 */
export function normalizeClassroomId(classroomId) {
  if (!classroomId) return null;
  
  // If it's a populated object, get the _id
  if (typeof classroomId === 'object' && classroomId._id) {
    const idValue = classroomId._id;
    // Convert to string if it's an ObjectId
    if (typeof idValue === 'object' && typeof idValue.toString === 'function') {
      return idValue.toString();
    }
    // Handle primitive values
    if (typeof idValue === 'string') {
      return idValue;
    }
    // Fallback for other types
    return String(idValue);
  }
  
  // Convert to string if it's an ObjectId (has toString method)
  if (typeof classroomId === 'object' && typeof classroomId.toString === 'function') {
    const stringValue = classroomId.toString();
    // Only return if toString() produced a meaningful value (not '[object Object]')
    if (stringValue && stringValue !== '[object Object]') {
      return stringValue;
    }
  }
  
  // If we reach here, the object doesn't have a proper toString or it's invalid
  return null;
}

/**
 * Extracts student and classroom IDs from request user object
 * @param {Object} user - Request user object with student property
 * @returns {Object} - Object with studentId and classroomId
 */
export function extractStudentIds(user) {
  const student = user?.student;
  
  if (!student) {
    return { studentId: null, classroomId: null };
  }
  
  return {
    studentId: normalizeStudentId(student),
    classroomId: normalizeClassroomId(student.classroomId)
  };
}
