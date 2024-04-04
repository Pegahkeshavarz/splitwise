import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'

const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password)
        }
    }

    return (
        <>
            <div className="login-container">
                <div className="text-center mb-6">
                    <div className="mt-2">
                        <h3>Create a New Account</h3>
                    </div>

                </div>

                <form
                    onSubmit={onSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label>
                            Email
                        </label>
                        <input
                            type="email"
                            autoComplete='email'
                            required
                            value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        />
                    </div>

                    <div>
                        <label>
                            Password
                        </label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete='new-password'
                            required
                            value={password} onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        />
                    </div>

                    <div>
                        <label>
                            Confirm Password
                        </label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete='off'
                            required
                            value={confirmPassword} onChange={(e) => {
                            setconfirmPassword(e.target.value)
                        }}/>
                    </div>

                    {errorMessage && (
                        <span>{errorMessage}</span>
                    )}

                    <button
                        type="submit"
                        disabled={isRegistering}
                    >
                        {isRegistering ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <div className="text-sm text-center">
                        Already have an account? {'   '}
                        <Link to={'/login'}>Continue</Link>
                    </div>
                </form>
            </div>
        </>
    )
};

export default Register;


