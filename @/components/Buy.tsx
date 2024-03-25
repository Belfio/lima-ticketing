import { Button } from "./ui/button";

export default function Buy() {
  return (
    <div>
      <h1>Buy</h1>
      <p>
        This is a simple example of a component that is not part of the main
        system but is a standalone component that can be used in any other
        system.
      </p>
      <p>
        It is a good practice to keep components that are not part of the main
        system in a separate folder.
      </p>
      <a href="https://buy.stripe.com/aEUaGs6Aq5j2dUs289">
        <Button>Buy</Button>
      </a>
    </div>
  );
}
