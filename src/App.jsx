import './App.css';
import LeftPanal from './layout/LeftPanal/LeftPanal';
import Body from './layout/Body/Body';
import Header from './components/Header/Header';
import JournalList from './components/JournalList/JournalList';
import JournalAddButton from './components/JournalAddButton/JournalAddButton';
import JournalForm from './components/JournalForm/JournalForm';
import { useLocalStorage } from './hooks/use-localstorage.hook';
import { UserContextProvide } from './context/user.context';
import { useState } from 'react';

const mapItems = items => {
  if (!items) {
    return [];
  }
  return items.map(i => ({
    ...i,
    date: new Date(i.date),
  }));
};

const App = () => {
  const [items, setItems] = useLocalStorage('data');
  const [selectedItem, setSelectesItem] = useState(null);

  const addItem = item => {
    if (!item.id) {
      setItems([
        {
          ...item,
          date: new Date(item.date),
          id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        },
        ...mapItems(items),
      ]);
    } else {
      setItems([
        ...mapItems(items).map(i => {
          if (i.id === item.id) {
            return {
              ...item,
            };
          }
          return i;
        }),
      ]);
    }
  };

  const deleteItem = id => {
    setItems([...items.filter(i => i.id !== id)]);
  };

  return (
    <UserContextProvide>
      <div className="app">
        <LeftPanal>
          <Header />
          <JournalAddButton clearForm={() => setSelectesItem(null)} />
          <JournalList items={mapItems(items)} setItem={setSelectesItem} />
        </LeftPanal>
        <Body>
          <JournalForm
            onSubmit={addItem}
            onDelete={deleteItem}
            data={selectedItem}
          />
        </Body>
      </div>
    </UserContextProvide>
  );
};

export default App;
