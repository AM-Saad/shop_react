


import { useField } from "formik";



interface Props {
  label: string;
  id?: string;
  name: string;
  placeholder?: string
  data?: string;
  className?: string;
  type?: string;
}

const Input: React.FC<Props> = ({ label, ...props }) => {
  console.log()
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <div className="grid w-full">
      <div className="flex items-center gap-3">
        <label htmlFor={props.id || props.name}>{label}</label>

        {meta.touched && meta.error ? (
          <div className="error text-red-400 text-sm">{meta.error}</div>
        ) : null}
      </div>
      <input {...field}  {...props} />
    </div>
  );
};

export default Input
