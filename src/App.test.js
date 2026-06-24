import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the SEO h1 in the DOM', () => {
  render(<App />);
  const h1 = screen.getByRole('heading', {
    level: 1,
    name: /Baking Measurement & Ingredient Converter/i,
  });
  expect(h1).toBeInTheDocument();
});

test('renders the static conversion charts heading and an expected ingredient', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { level: 2, name: /Common Ingredient Conversion Charts/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/All-Purpose Flour/i)).toBeInTheDocument();
});
