import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, CardTitle, CardText, Label, Button, Form, Input, FormFeedback } from 'reactstrap'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import illustrationsLight from '@src/assets/images/pages/register-v2.svg'
import illustrationsDark from '@src/assets/images/pages/register-v2-dark.svg'
import { api_url } from '@src/common/Helpers'
import toast from 'react-hot-toast';
const Register = () => {
  const skin = 'dark' // Replace this with your actual skin value
  const source = skin === 'dark' ? illustrationsDark : illustrationsLight
  // Inside the handleSubmit function
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the terms checkbox is checked
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
      const toastId = toast.error('You must agree to the privacy policy and terms.', {
        duration: 6000, // Set a custom duration for the toast
      });
      return;
    }

    // Validate and handle API request
    if (username && email && password) {
      try {
        const response = await fetch(api_url+ 'register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username,email, password }),
        });

        if (response.ok) {
          const responseData = await response.json();
          // Handle successful response data, e.g. redirect or show success message
          console.log('API Response:', responseData);
        } else {
          // Handle non-200 response, e.g. show error message
          console.error('API Error:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        // Handle fetch error, e.g. show error message
      }
    }
  };


  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          {/* Your logo SVG or text */}
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Adventure starts here 🚀
            </CardTitle>
            <CardText className='mb-2'>Make your app management easy and fun!</CardText>

            <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit}>
              <div className='mb-1'>
                <Label className='form-label' for='register-username'>
                  Username
                </Label>
                <Input autoFocus placeholder='johndoe' value={username} onChange={(e) => setUsername(e.target.value)}/>
                {/* Additional validation/error handling */}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-email'>
                  Email
                </Label>
                <Input type='email' placeholder='john@example.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
                {/* Additional validation/error handling */}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-password'>
                  Password
                </Label>
                <Input type='password' placeholder='********' value={password} onChange={(e) => setPassword(e.target.value)}/>
                {/* Additional validation/error handling */}
              </div>
              <div className='form-check mb-1'>
                <Input id='terms' type='checkbox' />
                <Label className='form-check-label' for='terms'>
                  I agree to{' '}
                  <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </a>
                </Label>
                {/* Additional validation/error handling */}
              </div>
              <Button type='submit' block color='primary'>
                Sign up
              </Button>
            </Form>
            {/* Rest of the component */}
            <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/login'>
                <span>Sign in instead</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-around'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
