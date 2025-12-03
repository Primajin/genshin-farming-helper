import { render, screen } from '@testing-library/react';
import PresetPicker from '../preset-picker';

test('renders preset picker', () => {
  render(<PresetPicker onClose={() => {}} onAddPreset={() => {}} />);
  expect(screen.getByText('Preset Picker')).toBeInTheDocument();
});
