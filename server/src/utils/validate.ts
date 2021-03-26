import { RegisterInput, FieldError } from "../dtos/user";

export const validateRegister = (options: RegisterInput): FieldError[] | null => {
    if (options.email.length <= 2) {
        return [new FieldError("email", "length must be greater than 2")];
    }

    if (options.password.length <= 3) {
        return [new FieldError("password", "length must be greater than 3")];
    }

    if (options.name.length <= 2) {
        return [new FieldError("name", "length must be greater than 2")];
    }

    return null;
};
