import { useState } from 'react';
import { useRouter } from 'next/router';
import { getPostBySlug, updatePost, uploadPic } from '@lib/firebase';
import { useAuth } from '@contexts/auth';
import { Layout } from '@components';
import styles from '@styles/edit.module.scss';

import { Container, FormGroup } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl'

const EditPage = ({ post }) => {
  const router = useRouter();
  const [user, userLoading] = useAuth();
  const [values, setValues] = useState(post);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(post.coverImage)

  const [picPrev, setPicPrev] = useState(null)

  if (userLoading) {
    return null;
  }

  if (!user && typeof window !== 'undefined') {
    router.push('/signin');
    return null;
  }

  const handleChange = (e) => {
    const id = e.target.id;
    const newValue = e.target.value;

    setValues({ ...values, [id]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    values.coverImage = await uploadPic(picPrev, user)

    setIsLoading(true);
    updatePost(values)
      .then(() => {
        setIsLoading(false);
        router.push(`/post/${post.Id}`);
      })
      .catch((err) => {
        alert(err);
        setIsLoading(false);
      });
  }
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setPicPrev(file)
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  }

   return (
    <FormGroup>
    <Card sx={{ maxWidth: 450, margin: "auto" }}>
      <Typography align="center" variant="h3"sx={{textDecoration: 'underline'}}>Edit post</Typography>
      <CardActionArea>
        <Input type="file" id="pic" accept="image/*" onChange={handleFileUpload}></Input>
        {imageUrl && <img src={imageUrl} alt="Uploaded Image" height="300" />}

      </CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div"sx={{padding:1}}>
            Add your title:
          </Typography>
          <Input fullWidth type="text" id="title" value={values.title} onChange={handleChange} placeholder="Type here..."sx={{padding:1}}/>
        </CardContent>
        <Button 
        variant="outlined" 
        startIcon={<DeleteIcon />} 
        sx={{padding:1, margin:1}}
        >
          Clear
        </Button>
        <Button variant="contained" endIcon={<SendIcon />} sx={{padding:1, margin:1}}type="submit" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
    </Card>
    </FormGroup>
  )
}

export async function getServerSideProps(title) {
  const post = await getPostBySlug(title.query.Id);

  return {
    props: {
      post,
    },
  };
}

export default EditPage;
