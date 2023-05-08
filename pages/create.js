import { useState } from 'react'
import { useRouter } from 'next/router' // this is new
import { createPost, uploadPic } from '@lib/firebase' // this is new
import { Layout } from '@components'
import { useAuth } from '@contexts/auth'


import { Container, FormGroup } from "@mui/material"
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'

const CreatePage = () => {

  const router = useRouter() // this is new
  const [formValues, setFormValues] = useState({
    Id: '',
    User: '',
    title: '',
    coverImage: '',
  })


  const [isLoading, setIsLoading] = useState(false)
  const [user, userLoading] = useAuth()
  const [imageUpload, setImageUpload] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const [picPrev, setPicPrev] = useState(null)

  /*
  This is the function we're passing to each control so we can capture
  the value in it and store it in our `formValues` variable.
  */
  const handleChange = (e) => {
    const id = e.target.id
    const newValue = e.target.value

    setFormValues({ ...formValues, [id]: newValue })
  }

    if (userLoading) {
      return null
    }
    
    if (!user && typeof window !== 'undefined') {
      router.push('/signin')
      return null
    }

  const handleSubmit = async (e) => {

    formValues.Id = (user.email + picPrev.name).replace(/[^a-zA-Z0-9]/g, "")
    formValues.User = user.displayName

    formValues.coverImage = await uploadPic(picPrev, user)


    e.preventDefault()

    setIsLoading(true)

    createPost(formValues)
    .then(() => {
      // Update the isLoading state and navigate to the home page.
      setIsLoading(false)
      router.push('/')
    })
    .catch((err) => {
      // Alert the error and update the isLoading state.
      alert(err)
      setIsLoading(false)
    })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setPicPrev(file)
    const reader = new FileReader()

    reader.onloadend = () => {
      setImageUrl(reader.result)
    }

    reader.readAsDataURL(file)
  }

  const test = () => {

  }

  return (
    <Layout>
    <FormGroup>
    <Card sx={{ maxWidth: 450, margin: "auto" }}>
      <Typography align="center" variant="h3"sx={{textDecoration: 'underline'}}>Create a new post</Typography>
      <CardActionArea>
        <Input type="file" id="pic" accept="image/*" onChange={handleFileUpload}></Input>
        {imageUrl && <img src={imageUrl} alt="Uploaded Image" height="300" />}

      </CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div"sx={{padding:1}}>
            Add your title:
          </Typography>
          <Input fullWidth type="text" id="title" value={formValues.title} onChange={handleChange} placeholder="Type here..."sx={{padding:1}}/>
        </CardContent>
        <Button 
        variant="outlined" 
        startIcon={<DeleteIcon />} 
        sx={{padding:1, margin:1}}
        onClick={test}
        >
          Clear
        </Button>
        <Button variant="contained" endIcon={<SendIcon />} sx={{padding:1, margin:1}}type="submit" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
    </Card>
    </FormGroup>
    </Layout>
  )
}
export default CreatePage