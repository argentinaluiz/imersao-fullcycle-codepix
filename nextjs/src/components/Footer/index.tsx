import classes from './Footer.module.scss';

const Footer:React.FunctionComponent = () => {
  return (
    <footer className={classes.root}>
      <img src="/img/logo-pix.png" alt="Code Pix" />
    </footer>
  );
};

export default Footer;
