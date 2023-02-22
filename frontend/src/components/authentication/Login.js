import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    console.log('You tried to submit the form');
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
      >
        Log In
      </Button>
      <Button
        colorScheme={'red'}
        width = '100%'
        style={{marginTop: 15}}
        onClick = {() => {
          setEmail('trymyapp@guest.com');
          setPassword('guestpassword');
        }}
      >
        Get guest user credentials ?
      </Button>
    </VStack>
  )
}

export default Login