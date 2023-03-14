import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodInt {
  id: number,
  name: string,
  description: string,
  price: number,
  available: boolean,
  image: string
}

function Dashboard() {

  const [foods, setFoods ] = useState<FoodInt[]>([])
  const [editingFood, setEditingFood ] = useState<FoodInt>(
    {} as FoodInt
  )
  const [modalOpen, setModalOpen ] = useState(false)
  const [editModalOpen, setEditModalOpen ] = useState(false)


  useEffect(() => {
    async function componentDidMount () {
      const response = await api.get('/foods');
  
      setFoods(response.data)
  
    }

    componentDidMount()
  }, [])

  

  const handleAddFood = async (food: FoodInt) => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([ ...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodInt) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {

    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {

    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodInt) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

 
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}  //estado booleano que dita se o modal está aperto ou fechado
          setIsOpen={toggleEditModal} //função que invoca o setEditModalOpen alterando o estado editModalOpen           

          editingFood={editingFood} //estado que recebe o food alterado
          handleUpdateFood={handleUpdateFood} // função que 
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }

export default Dashboard;
