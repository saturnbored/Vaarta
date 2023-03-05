import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    console.log(pics);
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'vaarta');
      data.append('cloud_name', 'drrequdfx');
      fetch('https://api.cloudinary.com/v1_1/drrequdfx/image/upload', {
        method: 'post',
        body: data,
      }).then((res) => res.json()).then((data) => {
        setPic(data.url.toString());
        console.log(data.url.toString());
        setLoading(false);
      }).catch((error) => {
        console.log(error.message);
        setLoading(false);
      })
    } else {
      toast({
        title: 'Please select an image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

  }

  const handleSubmit = async () => {
    setLoading(true);
    if(!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all the required details.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    if(password !== confirmPassword) {
      toast({
        title: 'Passwords do not match.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        }
      };

      const {data} = await axios.post('api/user', {
        name,
        email,
        password,
        pic
      }, config);

      toast({
        title: 'Registration Successful.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right'
      });
      setLoading(false);
      console.log(error);
    }
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
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => {
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
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => {
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
          type='file'
          p={1.5}
          accept='image/'
          placeholder='Upload your photo'
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme={'green'}
        width='100%'
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading = {loading}
      >
        Register
      </Button>
    </VStack>
  )
}

export default Signup