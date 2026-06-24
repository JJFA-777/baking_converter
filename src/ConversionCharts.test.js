import { render, screen, within } from '@testing-library/react';
import ConversionCharts from './ConversionCharts';

test('renders the heading and intro for SEO', () => {
  render(<ConversionCharts />);
  const heading = screen.getByRole('heading', { level: 2, name: /Common Ingredient Conversion Charts/i });
  expect(heading).toBeInTheDocument();
});

test('renders all 10 ingredient rows with the expected names', () => {
  render(<ConversionCharts />);
  const table = screen.getByRole('table', { name: /baking ingredient density chart/i });
  const expected = [
    'All-Purpose Flour',
    'Granulated Sugar',
    'Brown Sugar (packed)',
    'Butter',
    'Powdered / Icing Sugar',
    'Whole Wheat Flour',
    'Honey',
    'Cocoa Powder',
    'Rolled Oats (old-fashioned)',
    'Heavy / Whipping Cream',
  ];
  const rows = within(table).getAllByRole('row');
  // First row is the header; data rows follow.
  expect(rows.length - 1).toBe(expected.length);
  for (const name of expected) {
    const cell = within(table).getByText(name);
    expect(cell).toBeInTheDocument();
  }
});

test('each row exposes grams, ounces, and millilitres columns', () => {
  render(<ConversionCharts />);
  const table = screen.getByRole('table', { name: /baking ingredient density chart/i });
  // Spot-check the all-purpose flour row text content.
  const flourRow = within(table).getByText('All-Purpose Flour').closest('tr');
  expect(flourRow.textContent).toMatch(/120/);   // grams per US cup
  expect(flourRow.textContent).toMatch(/4\.2/);  // ounces (120 / 28.3495)
  expect(flourRow.textContent).toMatch(/122/);   // 240 ml in grams
});
