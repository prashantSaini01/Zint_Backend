import Template from "../models/Template.js";



  export const getTemplates = async (event) => {
    try {
      const templates = await Template.find();
      return {
        statusCode: 200,
        body: JSON.stringify(templates), // Return the array directly
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }
  };




export const createTemplate = async (event) => {
  try {
    // Parse the event body
    const body = JSON.parse(event.body);
    const { name, description, subtasks, frequency, frequencyDetails } = body;

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Template name is required' }),
      };
    }

    const newTemplate = new Template({
      name,
      description: description || '',
      frequency: frequency || 'none',
      frequencyDetails: frequencyDetails || null,
      subtasks: subtasks || [],
    });

    await newTemplate.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Template created successfully', template: newTemplate }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};


export const deleteTemplate = async (event) => {
  try {
    const { id } = event.pathParameters;
    console.log(id);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Template ID is required' }),
      };
    }

    const deletedTemplate = await Template.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Template not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Template deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};


export const getTemplateById = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Template ID is required' }),
      };
    }

    const template = await Template.findById(id);

    if (!template) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Template not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(template),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};



export const updateTemplate = async (event) => {
  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);
    const { name, description, frequency, frequencyDetails, subtasks } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Template ID is required' }),
      };
    }

    const template = await Template.findById(id);

    if (!template) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Template not found' }),
      };
    }

    // Update fields if they are provided in the request body
    if (name) template.name = name;
    if (description) template.description = description;
    if (frequency) template.frequency = frequency;
    if (frequencyDetails) template.frequencyDetails = frequencyDetails;
    if (subtasks) template.subtasks = subtasks;

    await template.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Template updated successfully', template }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};