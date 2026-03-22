interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {

  return <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className='border rounded-md w-64 bg-zinc-800 px-4 py-1'
    placeholder='Search authors...'
  />
}