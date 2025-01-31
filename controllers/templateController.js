import Template from "../models/Template.js";

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    return res.status(200).json(templates); // Return the array directly as JSON
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const { name, description, subtasks, frequency, frequencyDetails, boardId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Template name is required' });
    }

    const newTemplate = new Template({
      name,
      description: description || '',
      frequency: frequency || 'none',
      frequencyDetails: frequencyDetails || null,
      subtasks: subtasks || [],
      boardId: boardId || null,
    });

    await newTemplate.save();

    return res.status(201).json({ message: 'Template created successfully', template: newTemplate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params; // Using params for path parameters

    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const deletedTemplate = await Template.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

    return res.status(200).json(template);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, frequency, frequencyDetails, subtasks } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Update fields if they are provided in the request body
    if (name) template.name = name;
    if (description) template.description = description;
    if (frequency) template.frequency = frequency;
    if (frequencyDetails) template.frequencyDetails = frequencyDetails;
    if (subtasks) template.subtasks = subtasks;

    await template.save();

    return res.status(200).json({ message: 'Template updated successfully', template });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
