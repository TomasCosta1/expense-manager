import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ExpenseEditDialog from '../ExpenseEditDialog/ExpenseEditDialog';
import { getExpensesPaginated, deleteExpense } from '../../api/expenses';
import { getCategories } from '../../api/categories';
import { getSubcategoriesByCategory } from '../../api/subcategories';
import { getPaymentMethods } from '../../api/paymentMethods';

const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
];

const columns = [
    { id: 'date', label: 'Fecha', minWidth: 170 },
    { id: 'name', label: 'Nombre', minWidth: 170 },
    { 
        id: 'amount', 
        label: 'Monto', 
        minWidth: 100,
        format: (value) => `$ ${value}` 
    },
    {
        id: 'subcategory',
        label: 'Subcategoría',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'category',
        label: 'Categoría',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'actions',
        label: 'Acciones',
        minWidth: 120,
        align: 'center'
    }
];

export default function ExpensesList({ refreshKey }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [expenses, setExpenses] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [expenseToDelete, setExpenseToDelete] = React.useState(null);
    const [deleting, setDeleting] = React.useState(false);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [expenseToEdit, setExpenseToEdit] = React.useState(null);
    
    // Filter states
    const [categories, setCategories] = React.useState([]);
    const [subcategories, setSubcategories] = React.useState([]);
    const [paymentMethods, setPaymentMethods] = React.useState([]);
    const [filters, setFilters] = React.useState({
        category_id: '',
        subcategory_id: '',
        payment_method_id: '',
        month: new Date().getMonth() + 1, // Mes actual (1-12)
        year: new Date().getFullYear() // Año actual
    });
    
    // Sort states
    const [sort, setSort] = React.useState({
        field: 'date',
        direction: 'DESC'
    });

    // Load filter options
    const loadFilterOptions = React.useCallback(async () => {
        try {
            const [categoriesRes, paymentMethodsRes] = await Promise.all([
                getCategories(),
                getPaymentMethods()
            ]);
            // Handle different response formats
            setCategories(categoriesRes.data || categoriesRes || []);
            setPaymentMethods(paymentMethodsRes.data || paymentMethodsRes || []);
        } catch (error) {
            console.error('Error loading filter options:', error);
            setCategories([]);
            setPaymentMethods([]);
        }
    }, []);

    // Load subcategories when category changes
    const loadSubcategories = React.useCallback(async (categoryId) => {
        if (!categoryId) {
            setSubcategories([]);
            return;
        }
        try {
            const response = await getSubcategoriesByCategory(categoryId);
            // Handle different response formats
            setSubcategories(response.data || response || []);
        } catch (error) {
            console.error('Error loading subcategories:', error);
            setSubcategories([]);
        }
    }, []);

    // Función para cargar gastos con paginación, filtros y ordenamiento
    const loadExpenses = React.useCallback(async (pageNum, limitNum, currentFilters = {}, currentSort = {}) => {
        setLoading(true);
        try {
            // Clean filters (remove empty values)
            const cleanFilters = Object.fromEntries(
                Object.entries(currentFilters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
            );
            
            const response = await getExpensesPaginated(pageNum, limitNum, cleanFilters, currentSort);
            setExpenses(response.data.data);
            setTotalCount(response.data.pagination.total);
        } catch (error) {
            console.error('Error loading expenses:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar opciones de filtros al inicializar
    React.useEffect(() => {
        loadFilterOptions();
    }, [loadFilterOptions]);

    // Cargar subcategorías cuando cambia la categoría seleccionada
    React.useEffect(() => {
        loadSubcategories(filters.category_id);
        // Reset subcategory when category changes
        if (filters.subcategory_id) {
            setFilters(prev => ({ ...prev, subcategory_id: '' }));
        }
    }, [filters.category_id, filters.subcategory_id, loadSubcategories]);

    // Cargar datos iniciales y cuando cambian filtros/ordenamiento
    React.useEffect(() => {
        loadExpenses(page, rowsPerPage, filters, sort);
    }, [page, rowsPerPage, filters, sort, loadExpenses]);

    // Recargar cuando se crea un nuevo gasto
    React.useEffect(() => {
        if (refreshKey > 0) {
            loadExpenses(page, rowsPerPage, filters, sort);
        }
    }, [refreshKey, page, rowsPerPage, filters, sort, loadExpenses]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = +event.target.value;
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setPage(0); // Reset to first page when filtering
    };

    const handleSortChange = (field) => {
        setSort(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'DESC' ? 'ASC' : 'DESC'
        }));
        setPage(0); // Reset to first page when sorting
    };

    const handleClearFilters = () => {
        setFilters({
            category_id: '',
            subcategory_id: '',
            payment_method_id: '',
            month: new Date().getMonth() + 1, // Reset al mes actual
            year: new Date().getFullYear() // Reset al año actual
        });
        setPage(0);
    };

    const handleEditClick = (expense) => {
        setExpenseToEdit(expense);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (expense) => {
        setExpenseToDelete(expense);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!expenseToDelete) return;

        setDeleting(true);
        try {
            await deleteExpense(expenseToDelete.id);
            // Recargar la lista después de eliminar
            await loadExpenses(page, rowsPerPage, filters, sort);
            setDeleteDialogOpen(false);
            setExpenseToDelete(null);
        } catch (error) {
            console.error('Error deleting expense:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setExpenseToDelete(null);
    };

    const handleEditSave = () => {
        // Recargar la lista después de editar
        loadExpenses(page, rowsPerPage, filters, sort);
        setEditDialogOpen(false);
        setExpenseToEdit(null);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setExpenseToEdit(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Filtros y Ordenamiento */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Filtro por Categoría */}
                    <Grid item xs={12} sm={6} md={2.5}>
                        <FormControl fullWidth sx={{ minWidth: 160 }} size='small'>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={filters.category_id}
                                label="Categoría"
                                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                            >
                                {(categories || []).map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Filtro por Subcategoría */}
                    <Grid item xs={12} sm={6} md={2.5}>
                        <FormControl fullWidth sx={{ minWidth: 160 }} size='small'>
                            <InputLabel>Subcategoría</InputLabel>
                            <Select
                                value={filters.subcategory_id}
                                label="Subcategoría"
                                onChange={(e) => handleFilterChange('subcategory_id', e.target.value)}
                                disabled={!filters.category_id}
                            >
                                {(subcategories || []).map((subcategory) => (
                                    <MenuItem key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Filtro por Método de Pago */}
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth sx={{ minWidth: 160 }} size='small'>
                            <InputLabel>Método de Pago</InputLabel>
                            <Select
                                value={filters.payment_method_id}
                                label="Método de Pago"
                                onChange={(e) => handleFilterChange('payment_method_id', e.target.value)}
                            >
                                {(paymentMethods || []).map((method) => (
                                    <MenuItem key={method.id} value={method.id}>
                                        {method.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Filtro por Mes */}
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth sx={{ minWidth: 120 }} size='small'>
                            <InputLabel>Mes</InputLabel>
                            <Select
                                value={filters.month}
                                label="Mes"
                                onChange={(e) => handleFilterChange('month', e.target.value)}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Ordenamiento */}
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth sx={{ minWidth: 100 }} size='small'>
                            <InputLabel>Ordenar por</InputLabel>
                            <Select
                                value={sort.field}
                                label="Ordenar por"
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <MenuItem value="date">Fecha</MenuItem>
                                <MenuItem value="amount">Monto</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Botón Limpiar Filtros */}
                    <Grid item xs={12} sm={6} md={1}>
                        <Button
                            variant="outlined"
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                            size="small"
                            fullWidth
                        >
                            Limpiar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ 
                                            minWidth: column.minWidth,
                                            cursor: column.id === 'date' || column.id === 'amount' ? 'pointer' : 'default'
                                        }}
                                        onClick={() => {
                                            if (column.id === 'date' || column.id === 'amount') {
                                                handleSortChange(column.id);
                                            }
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" justifyContent={column.align === 'right' ? 'flex-end' : 'flex-start'}>
                                            {column.label}
                                            {(column.id === 'date' || column.id === 'amount') && sort.field === column.id && (
                                                sort.direction === 'ASC' ? 
                                                    <ArrowUpwardIcon sx={{ ml: 1, fontSize: 16 }} /> : 
                                                    <ArrowDownwardIcon sx={{ ml: 1, fontSize: 16 }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={expense.id}>
                                        {columns.map((column) => {
                                            if (column.id === 'actions') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditClick(expense)}
                                                            sx={{ mr: 1 }}
                                                            color="primary"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteClick(expense)}
                                                            color="error"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                );
                                            }
                                            
                                            const value = expense[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        ¿Estás seguro de que deseas eliminar el gasto "{expenseToDelete?.name}"?
                        <br />
                        <strong>Esta acción no se puede deshacer.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleDeleteCancel} 
                        disabled={deleting}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de edición */}
            <ExpenseEditDialog
                open={editDialogOpen}
                expense={expenseToEdit}
                onClose={handleEditClose}
                onSave={handleEditSave}
            />
        </>
    );
}