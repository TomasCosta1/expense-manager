import React from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { getCategories } from '../../api/categories';
import { getSubcategoriesByCategory } from '../../api/subcategories';
import { getPaymentMethods } from '../../api/paymentMethods';
import { createExpense } from '../../api/expenses';

const ExpensesForm = ({ onExpenseCreated }) => {
    const [formData, setFormData] = React.useState({
        date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        name: '',
        amount: '',
        category: '',
        subcategory: '',
        paymentMethod: ''
    });
    const [categories, setCategories] = React.useState([]);
    const [subcategories, setSubcategories] = React.useState([]);
    const [paymentMethods, setPaymentMethods] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [message, setMessage] = React.useState({ type: '', text: '' });

    // Cargar categorías al montar el componente
    React.useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
            try {
                const paymentMethodsData = await getPaymentMethods();
                setPaymentMethods(paymentMethodsData);
            } catch (error) {
                console.error('Error loading payment methods:', error);
            }
        };
        loadCategories();
    }, []);

    // Cargar subcategorías cuando cambia la categoría
    React.useEffect(() => {
        const loadSubcategories = async () => {
            if (formData.category) {
                setLoading(true);
                try {
                    const subcategoriesData = await getSubcategoriesByCategory(formData.category);
                    setSubcategories(subcategoriesData);
                } catch (error) {
                    console.error('Error loading subcategories:', error);
                    setSubcategories([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setSubcategories([]);
            }
        };
        loadSubcategories();
    }, [formData.category]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Resetear subcategoría si cambia la categoría
            ...(name === 'category' && { subcategory: '' })
        }));
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setFormData(prev => ({
            ...prev,
            category: categoryId,
            subcategory: '' // Resetear subcategoría
        }));
    };

    const handleSubcategoryChange = (event) => {
        setFormData(prev => ({
            ...prev,
            subcategory: event.target.value
        }));
    };

    const handlePaymentMethodChange = (event) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validar campos requeridos
        if (!formData.date || !formData.name || !formData.amount || !formData.category || formData.category === '' || !formData.subcategory || formData.subcategory === '' || !formData.paymentMethod || formData.paymentMethod === '') {
            setMessage({ type: 'error', text: 'Todos los campos son requeridos' });
            return;
        }

        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const expenseData = {
                date: formData.date,
                name: formData.name,
                amount: parseFloat(formData.amount),
                category_id: formData.category,
                subcategory_id: formData.subcategory,
                payment_method_id: formData.paymentMethod
            };

            await createExpense(expenseData);
            
            // Limpiar formulario
            setFormData({
                date: new Date().toISOString().split('T')[0],
                name: '',
                amount: '',
                category: '',
                subcategory: '',
                paymentMethod: ''
            });
            
            // Limpiar también las subcategorías
            setSubcategories([]);
            
            setMessage({ type: 'success', text: 'Gasto creado exitosamente' });
            
            // Notificar al componente padre que se creó un gasto
            if (onExpenseCreated) {
                onExpenseCreated();
            }
        } catch (error) {
            console.error('Error creating expense:', error);
            
            // Mostrar mensaje de error más específico
            let errorMessage = 'Error al crear el gasto';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
            
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 2 }}>
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}
            
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        id="date" 
                        name="date"
                        label="Fecha" 
                        variant="outlined" 
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        id="name" 
                        name="name"
                        label="Nombre" 
                        variant="outlined" 
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </Grid>

                {/* Segunda fila: Monto solo (centrado) */}
                <Grid item xs={12} sm={6}>
                    <TextField 
                        id="amount" 
                        name="amount"
                        label="Monto" 
                        variant="outlined" 
                        type="number" 
                        value={formData.amount}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        inputProps={{ step: "0.01", min: "0" }}
                    />
                </Grid>

                {/* Tercera fila: Categoría y Subcategoría */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={{ minWidth: 200 }}>
                        <InputLabel id="category-select-label">Categoría</InputLabel>
                        <Select
                            labelId="category-select-label"
                            id="category-select"
                            value={formData.category}
                            label="Categoría"
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!formData.category || loading} required sx={{ minWidth: 200 }}>
                        <InputLabel id="subcategory-select-label">Subcategoría</InputLabel>
                        <Select
                            labelId="subcategory-select-label"
                            id="subcategory-select"
                            value={formData.subcategory}
                            label="Subcategoría"
                            onChange={handleSubcategoryChange}
                        >
                            {subcategories.map((subcategory) => (
                                <MenuItem key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Cuarta fila: Método de pago */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={{ minWidth: 200 }}>
                        <InputLabel id="paymentMethods-select-label">Método de pago</InputLabel>
                        <Select
                            labelId="paymentMethods-select-label"
                            id="paymentMethods-select"
                            value={formData.paymentMethod}
                            label="Método de pago"
                            onChange={handlePaymentMethodChange}
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem key={method.id} value={method.id}>
                                    {method.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Botón en toda la fila */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button 
                            type="submit"
                            variant="contained" 
                            disabled={submitting}
                            size="large"
                        >
                            {submitting ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Gasto'
                            )}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ExpensesForm;