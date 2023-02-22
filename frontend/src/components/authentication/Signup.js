import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);

  const postDetails = (pic) => {
    console.log('you are inside postDetails function.');
  }

  const handleSubmit = () => {
    console.log('You tried to submit the form');
  }

  return (
    <VStack spacing='5px'>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter your name here'
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
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
      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Re-enter your password here'
            onChange={(e) => {
              setConfirmPassword(e.target.value);
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
      <FormControl id='pic' isRequired>
        <FormLabel>Picture</FormLabel>
        <Input
          type = 'file'
          p = {1.5}
          accept='image/'
          placeholder = 'Upload your photo'
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme={'green'}
        width = '100%'
        style={{marginTop: 15}}
        onClick = {handleSubmit}
      >
        Register
      </Button>
    </VStack>
  )
}

export default Signup