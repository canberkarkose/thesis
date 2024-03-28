type HomeProps = {
  temp?: string;
};

export const Home = ({ temp }: HomeProps) => (
  <div>
    <h1>Home</h1>
    {temp}
  </div>
);
