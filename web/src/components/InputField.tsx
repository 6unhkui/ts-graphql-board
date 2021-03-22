import React, { ChangeEventHandler, InputHTMLAttributes } from "react";
import { FormControl, FormLabel, FormErrorMessage, Input } from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    placeholder?: string;
    type?: string;
};

const InputField: React.FC<InputFieldProps> = ({ label, size: _, ...props }) => {
    const [field, { error }] = useField(props);

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};

export default InputField;
