import { useEffect } from 'react'
import { Formik, Form, useField, useFormik, useFormikContext } from "formik";
import * as Yup from "yup";
import { Link } from 'react-router-dom'
import { withFormik } from 'formik';
import Zone from '../../../models/Zone';

import Input from './Input'
import SelectBox from './SelectBox'
import { FormEvent } from "react";

const MyCheckbox = ({ children, ...props }: any) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <>
      <label className="checkbox">
        <input {...field} {...props} type="checkbox" />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const FormObserver: React.FC = () => {
  const { values } = useFormikContext();

  useEffect(() => {
    console.log("FormObserver::values", values);
  }, [values]);

  return null;
};

const validationScheme = Yup.object({
  firstname: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  lastname: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email addresss")
    .required("Required"),
  phone: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  street: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  apartment: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  floor: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  acceptedTerms: Yup.boolean()
    .required("Required")
    .oneOf([true], "You must accept the terms and conditions."),
  area: Yup.string()
    // specify the set of valid values for job type
    // @see http://bit.ly/yup-mixed-oneOf
    .oneOf(
      ["designer", "development", "product", "other"],
      "Invalid Job Type"
    )
    .required("Required")
})




const MyForm: React.FC<{ zones: Zone[] }> = ({ zones }) => {

  const handleOnChange = (event: FormEvent) => {
    console.log("Form::onChange", event);
  };
  return <Formik

    initialValues={{
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      street: "",
      apartment: "",
      floor: "",
      acceptedTerms: false,   // added for our checkbox
      area: "" // added for our select
    }}
    validationSchema={validationScheme}
    onSubmit={async (values, { setSubmitting }) => {
      // console.log('ay')
      // console.log(setSubmitting)
      console.log(values)
      // setSubmitting(false);
    }}

  >
    {({
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      errors,
    }: any) => {
      console.log({ errors })
      return (
        <form onSubmit={handleSubmit}>
            <FormObserver />
          <Input
            label="First Name"
            name="firstname"
            type="text"
            placeholder="Jane"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

          />
          <Input
            label="Last Name"
            name="lastname"
            type="text"
            placeholder="Doe"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="jane@formik.com"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

          />
          <Input
            label="Phone"
            name="phone"
            type="text"
            placeholder="0123456789"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

          />
          <Input
            label="Street"
            name="street"
            type="text"
            placeholder="1 main street"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

          />
          <Input
            label="Apartment"
            name="apartment"
            type="text"
            placeholder="7"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

          />
          <Input
            label="Floor"
            name="floor"
            type="number"
            placeholder="2"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"
          />
          <SelectBox
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

            label="Job Type" name="jobType">
            {zones.map(zone => <option value={zone.zoneId} key={zone.zoneId}>{zone.name}</option>)}
          </SelectBox>
          <MyCheckbox name="acceptedTerms">
            I accept the terms and conditions
          </MyCheckbox>
          <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
          <button
            type="submit"
            className="mt-5 w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Place Order</button>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{' '}
              <Link
                to="/shop"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Continue Shopping<span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          </div>
        </form>
      )
    }
    }
  </Formik>
}
export default MyForm



