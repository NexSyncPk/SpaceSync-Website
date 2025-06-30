class BaseValidator {
    validate = (schema, data) => {
        const { error, value } = schema.validate(data, { abortEarly: false });

        if (error) {
            const messages = error.details.map((detail) => detail.message);
            return {
                success: false,
                message: messages,
                data: null,
            };
        }

        return {
            success: true,
            message: null,
            data: value,
        };
    };
}

module.exports = BaseValidator;
