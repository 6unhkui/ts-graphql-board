import { useState, useEffect } from "react";

const useForm = (initValues, callback, validate) => {
    const [values, setValues] = useState(initValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clicked, setClicked] = useState("");

    useEffect(() => {
        // form submit이 되었고, validation이 모두 통과되었다면
        if (isSubmitting && Object.keys(errors).length === 0) {
            callback(); // 다음 액션(로그인, 회원가입 등) 유도
        }
    }, [callback, errors, isSubmitting]); // errors가 변경된 경우에만 update 될 수 있도록 두 번째 파라미터 전달

    // 사용자의 input 값을 가져와 values에 저장
    const handleChange = (event: Event) => {
        event.persist();
        setValues(state => ({
            ...state,
            [event.target.name]: event.target.value
        }));
    };

    // 재사용성을 높이기 위해 어떠한 submit button을 클릭하였는지 구분
    const handleClick = (event: Event) => {
        setClicked(event.target.value);
    };

    // form submit 확인 및 input 값을 validate하여 유효하지 않은 경우에는 error 메시지 저장
    const handleSubmit = (event: Event) => {
        if (event) event.preventDefault();
        setIsSubmitting(true);
        setErrors(validate(values, clicked));
    };

    return {
        handleChange,
        handleSubmit,
        handleClick,
        values,
        errors
    };
};

export default useForm;
