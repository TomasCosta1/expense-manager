import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { getCategories } from '../../api/categories';
import { getSubcategoriesByCategory } from '../../api/subcategories';
import { getPaymentMethods } from '../../api/paymentMethods';
import { updateExpense } from '../../api/expenses';

const ExpenseEditDialog = ({ open, expense, onClose, onSave }) => {
    const [formData, setFormData] = React.useState({
        date: '',
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

    // Función para cargar subcategorías (definida antes de los useEffect que la usan)
    const loadSubcategories = React.useCallback(async (categoryId) => {
        if (categoryId) {
            setLoading(true);
            try {
                const subcategoriesData = await getSubcategoriesByCategory(categoryId);
                setSubcategories(subcategoriesData);
                
                // Encontrar y establecer la subcategoría
                if (expense) {
                    const subcategory = subcategoriesData.find(sub => sub.name === expense.subcategory);
                    if (subcategory) {
                        setFormData(prev => ({ ...prev, subcategory: subcategory.id }));
                    }
                }
            } catch (error) {
                console.error('Error loading subcategories:', error);
                setSubcategories([]);
            } finally {
                setLoading(false);
            }
        } else {
            setSubcategories([]);
        }
    }, [expense]);

    // Cargar datos iniciales
    React.useEffect(() => {
        if (open) {
            const loadData = async () => {
                try {
                    const [categoriesData, paymentMethodsData] = await Promise.all([
                        getCategories(),
                        getPaymentMethods()
                    ]);
                    setCategories(categoriesData);
                    setPaymentMethods(paymentMethodsData);
                } catch (error) {
                    console.error('Error loading data:', error);
                }
            };
            loadData();
        }
    }, [open]);

    // Pre-cargar datos del gasto cuando se abre el modal
    React.useEffect(() => {
        if (expense && open) {
            setFormData({
                date: expense.date,
                name: expense.name,
                amount: expense.amount.toString(),
                category: '', // Lo cargaremos después de obtener las categorías
                subcategory: '',
                paymentMethod: ''
            });
        }
    }, [expense, open]);

    // Encontrar y establecer la categoría y subcategoría cuando se cargan las categorías
    React.useEffect(() => {
        if (expense && categories.length > 0) {
            const category = categories.find(cat => cat.name === expense.category);
            if (category) {
                setFormData(prev => ({ ...prev, category: category.id }));
                // Cargar subcategorías de esta categoría
                loadSubcategories(category.id);
            }
        }
    }, [expense, categories, loadSubcategories]);

    // Encontrar y establecer el método de pago
    React.useEffect(() => {
        if (expense && paymentMethods.length > 0) {
            const paymentMethod = paymentMethods.find(pm => pm.name === expense.payment_method);
            if (paymentMethod) {
                setFormData(prev => ({ ...prev, paymentMethod: paymentMethod.id }));
            }
        }
    }, [expense, paymentMethods]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'category' && { subcategory: '' })
        }));
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setFormData(prev => ({
            ...prev,
            category: categoryId,
            subcategory: ''
        }));
        loadSubcategories(categoryId);
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

            await updateExpense(expense.id, expenseData);
            setMessage({ type: 'success', text: 'Gasto actualizado exitosamente' });
            
            // Notificar al componente padre
            if (onSave) {
                onSave();
            }
            
            // Cerrar modal después de un breve delay
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (error) {
            console.error('Error updating expense:', error);
            
            let errorMessage = 'Error al actualizar el gasto';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
            
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            date: '',
            name: '',
            amount: '',
            category: '',
            subcategory: '',
            paymentMethod: ''
        });
        setSubcategories([]);
        setMessage({ type: '', text: '' });
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Editar Gasto</DialogTitle>
            <DialogContent>
                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            name="date"
                            label="Fecha" 
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            name="name"
                            label="Nombre" 
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            name="amount"
                            label="Monto" 
                            type="number" 
                            value={formData.amount}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            inputProps={{ step: "0.01", min: "0" }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required sx={{ minWidth: 200 }}>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={formData.category}
                                label="Categoría"
                                onChange={handleCategoryChange}
                                displayEmpty
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
                            <InputLabel>Subcategoría</InputLabel>
                            <Select
                                value={formData.subcategory}
                                label="Subcategoría"
                                onChange={handleSubcategoryChange}
                                displayEmpty
                            >
                                {subcategories.map((subcategory) => (
                                    <MenuItem key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required sx={{ minWidth: 200 }}>
                            <InputLabel>Método de pago</InputLabel>
                            <Select
                                value={formData.paymentMethod}
                                label="Método de pago"
                                onChange={handlePaymentMethodChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Seleccionar método de pago</em>
                                </MenuItem>
                                {paymentMethods.map((method) => (
                                    <MenuItem key={method.id} value={method.id}>
                                        {method.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained" 
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Actualizando...
                        </>
                    ) : (
                        'Guardar Cambios'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExpenseEditDialog;
