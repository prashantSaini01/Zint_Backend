// import Template from "../models/Template.js";
// import List from "../models/List.js"; // Import List model

// // Get all active templates for a given board
// export const getTemplates = async (req, res) => {
//   try {
//     const { id } = req.params; 
//     const boardId = id;
//     const templates = await Template.findActive({ boardId }); // Fetch only active templates
//     return res.status(200).json(templates);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // Create a new template
// export const createTemplate = async (req, res) => {
//   try {
//     const { id } = req.params; 
//     const boardId = id;
//     const { name, description, subtasks, frequency, frequencyDetails, listId, assignedUsers, dueDate } = req.body;

//     if (!name || !boardId) {
//       return res.status(400).json({ message: 'Template name and boardId are required' });
//     }

//     let finalListId = listId;

//     // If listId is not provided, fetch the first active list of the given board
//     if (!listId) {
//       const firstActiveList = await List.findOne({ boardId, deleted: false }).sort({ position: 1 }); // Get the first active list
//       if (firstActiveList) {
//         finalListId = firstActiveList._id;
//       } else {
//         return res.status(400).json({ message: 'No active lists found for the given board' });
//       }
//     }

//     console.log(finalListId)

//     const newTemplate = new Template({
//       name,
//       description: description || '',
//       frequency: frequency || 'none',
//       frequencyDetails: frequencyDetails || null,
//       subtasks: subtasks || [],
//       boardId: boardId,
//       listId: finalListId, // Ensure listId is set correctly
//       assignedUsers: assignedUsers || [],
//       dueDate: dueDate || null,
//     });

//     await newTemplate.save();

//     return res.status(201).json({ message: 'Template created successfully', template: newTemplate });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // Soft delete a template
// export const deleteTemplate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: 'Template ID is required' });
//     }

//     const template = await Template.findById(id);

//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }

//     await template.softDelete(); // Use the instance method to soft delete
//     return res.status(200).json({ message: 'Template soft-deleted successfully' });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // Get a template by ID, including only active subtasks
// export const getTemplateById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: 'Template ID is required' });
//     }

//     const template = await Template.findById(id);

//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }

//     const activeSubtasks = template.getActiveSubtasks(); // Fetch only active subtasks
//     return res.status(200).json({ ...template.toObject(), subtasks: activeSubtasks });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // Update a template
// export const updateTemplate = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, frequency, frequencyDetails, subtasks, boardId,assignedUsers } = req.body;

//     if (!id) {
//       return res.status(400).json({ message: 'Template ID is required' });
//     }

//     const template = await Template.findById(id);

//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }

//     // Update fields if they are provided in the request body
//     if (name) template.name = name;
//     if (description) template.description = description;
//     if (frequency) template.frequency = frequency;
//     if (frequencyDetails) template.frequencyDetails = frequencyDetails;
//     if (boardId) template.boardId = boardId;
//     if (assignedUsers) template.assignedUsers = assignedUsers;

//     // Handle subtasks update (including soft delete of subtasks)
//     if (subtasks) {
//       subtasks.forEach((updatedSubtask) => {
//         const existingSubtask = template.subtasks.id(updatedSubtask._id);

//         if (existingSubtask) {
//           // Update existing subtask fields
//           existingSubtask.name = updatedSubtask.name || existingSubtask.name;
//           existingSubtask.description = updatedSubtask.description || existingSubtask.description;

//           // Handle soft delete for the subtask
//           if (updatedSubtask.deleted !== undefined) {
//             existingSubtask.deleted = updatedSubtask.deleted;
//           }
//         } else {
//           // Add new subtask if it doesn't already exist
//           template.subtasks.push(updatedSubtask);
//         }
//       });
//     }

//     await template.save();

//     return res.status(200).json({ message: 'Template updated successfully', template });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };


import Template from "../models/Template.js";
import List from "../models/List.js"; // Import List model

// Get all active templates for a given board
export const getTemplates = async (req, res) => {
  try {
    const { id } = req.params; 
    const boardId = id;
    const templates = await Template.findActive({ boardId }); // Fetch only active templates
    return res.status(200).json(templates);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new template
export const createTemplate = async (req, res) => {
  try {
    const { id } = req.params; 
    const boardId = id;
    const { name, description, subtasks, frequency, frequencyDetails, listId, assignedUsers, dueDate } = req.body;

    if (!name || !boardId) {
      return res.status(400).json({ message: 'Template name and boardId are required' });
    }

    let finalListId = listId;

    // If listId is not provided, fetch the first active list of the given board
    if (!listId) {
      const firstActiveList = await List.findOne({ boardId, deleted: false }).sort({ position: 1 }); // Get the first active list
      if (firstActiveList) {
        finalListId = firstActiveList._id;
      } else {
        return res.status(400).json({ message: 'No active lists found for the given board' });
      }
    }

    console.log(finalListId);

    const newTemplate = new Template({
      name,
      description: description || '',
      frequency: frequency || 'none',
      frequencyDetails: frequencyDetails || null,
      subtasks: subtasks || [],
      boardId: boardId,
      listId: finalListId, // Ensure listId is set correctly
      assignedUsers: assignedUsers || [],
      dueDate: dueDate || null,
    });

    await newTemplate.save();

    return res.status(201).json({ message: 'Template created successfully', template: newTemplate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Soft delete a template
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await template.softDelete(); // Use the instance method to soft delete
    return res.status(200).json({ message: 'Template soft-deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a template by ID
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.status(200).json(template); // Include all subtasks without filtering
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, frequency, frequencyDetails, subtasks, boardId, assignedUsers } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Update basic fields if provided
    if (name) template.name = name;
    if (description) template.description = description;
    if (frequency) template.frequency = frequency;
    if (frequencyDetails) template.frequencyDetails = frequencyDetails;
    if (boardId) template.boardId = boardId;
    if (assignedUsers) template.assignedUsers = assignedUsers;

    // Handle subtasks update - completely replace the subtasks array



    if (subtasks && Array.isArray(subtasks)) {
      template.subtasks = subtasks.map((subtask) => ({
        ...subtask,
        completed: subtask.completed || false,
      }));
    }


    await template.save();
    return res.status(200).json({ 
      message: 'Template updated successfully', 
      template 
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return res.status(500).json({ message: error.message });
  }
};