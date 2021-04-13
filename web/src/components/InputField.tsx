import React, { InputHTMLAttributes } from "react";
import { FormControl, FormLabel, FormErrorMessage, Input, Textarea, ComponentWithAs } from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    placeholder?: string;
    type?: string;
    textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ label, textarea, size: _, ...props }) => {
    const [field, { error }] = useField(props);

    let InputOrTextarea: ComponentWithAs<"input" | "textarea"> = Input;
    if (textarea) {
        InputOrTextarea = Textarea;
    }

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};

export default InputField;
