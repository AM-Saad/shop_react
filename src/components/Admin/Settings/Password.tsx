import { useContext } from 'react'
import { Formik } from "formik";
import * as Yup from "yup";
import Input from '../../UI/Input'
import UserContext from '../../../store/User/user_context'


const validationScheme = Yup.object({
    oldPassword: Yup.string()
        .required("Required"),
    newPassword: Yup.string()
        .required("Required"),
    confirmPassword: Yup.string()
        .required("Required"),
})




const initialValues: { oldPassword: string, newPassword: string, confirmPassword: string } = { oldPassword: '', newPassword: '', confirmPassword: '', }


const MyForm: React.FC = () => {
    const { cartMeta, checkoutMeta, zones } = useContext(UserContext)


    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationScheme}
            onSubmit={async (values, { setSubmitting }) => {
                console.log(values);

            }}
        >
            {({ handleSubmit, errors }: any) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Current Password"
                            name="oldPassword"
                            type="password"
                            placeholder="********"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

                        />
                        <Input
                            label="New Password"
                            name="newPassword"
                            type="password"
                            placeholder="********"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="********"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3 my-2"

                        />


                    </form>
                )
            }
            }
        </Formik>
    )

}
export default MyForm



