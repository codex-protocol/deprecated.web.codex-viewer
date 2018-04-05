// TODO: Move to a common config location

const apiUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : 'http://ec2-34-238-117-54.compute-1.amazonaws.com'

export default {
  apiUrl,
}
