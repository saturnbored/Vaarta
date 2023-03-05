import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    if(!email || !password){
      toast({
        title: 'Please fill all details',
        status: 'warning',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    
    try {
      
      const config = {
        headers: {
          'Content-type': 'application/json',
        }
      };

      const {data} = await axios.post('/api/user/login', {
        email,
        password
      }, config);

      toast({
        title: 'Login Successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right'
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');

    } catch (error) {
      console.log(error.message);
      setLoading(false);
      toast({
        title: 'Error Occurred!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right'
      });
    }

  }

  return (
    <VStack spacing='5px'>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email here'
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value = {email}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter your password here'
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value = {password}
          />
          <InputRightElement width = '4.5rem'>
            <Button h = '1.75rem' size = 'sm' onClick = {() => {
              setShow(!show);
            }}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme={'green'}
        width = '100%'
        style={{marginTop: 15}}
        onClick = {handleSubmit}
        isLoading = {loading}
      >
        Log In
      </Button>
      <Button
        colorScheme={'red'}
        width = '100%'
        style={{marginTop: 15}}
        onClick = {() => {
          setEmail('guest@vaarta.com');
          setPassword('guestkapassword');
        }}
      >
        Get guest user credentials ?
      </Button>
    </VStack>
  )
}

export default Login