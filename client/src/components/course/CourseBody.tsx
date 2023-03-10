import React, { useState } from 'react'
import "./CourseBody.scss"
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { InputChange, RootStore, Course } from '../../utils/interface'
import dayjs from 'dayjs'
import PaginationComponent from '../globals/pagination/Pagination'
import { changePageCourse, deleteCourse, sortByCourseName, sortByDate, searchByCourseName, searchByCourseCode, searchByCourseTeacher } from '../../store/actions/courseActions'
import Loading from '../globals/loading/Loading'
// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ButtonGroup } from '@mui/material'
import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
import PrimaryTooltip from '../globals/tool-tip/Tooltip'
import CourseFormModal from './CourseFormModal'
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

const useStyles = makeStyles({
    TableContainer: {
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important"
    },
    TableCellHead: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "600 !important"
    },
    TableCellBody: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "500 !important",
    },

    TableCellBodyId: {
        fontSize: "1.4rem !important",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter,' Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
        fontWeight: "500 !important",
        "maxWidth": "150px",
        "WebkitLineClamp": "1",
        "WebkitBoxOrient": "vertical",
        "overflow": "hidden",
        "textOverflow": "ellipsis",
    },
    Button: {
        fontSize: "1rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "4px !important",
    },
    ButtonInfor: {
        padding: "0px !important",
        "& > a": {
            display: 'flex',
            alignItems: "center",
            justifyContent: "center"
        }
    },
    ButtonAdd: {
        fontSize: "1.2rem !important",
        fontWeight: "600 !important",
        height: "36px",
        padding: "4px !important",
        "& i": {
            marginTop: "-2px",
            fontSize: "1.6rem"
        }
    },
    Tooltip: {
        fontSize: "2rem !important",
    },
    Pagination: {
        "& button": { fontSize: "1.3rem" }
    }
});

const CourseBody = () => {

    const dispatch = useDispatch()
    const classes = useStyles()
    const { course: courses, auth, profile } = useSelector((state: RootStore) => state)
    const [searchByName, setSearchByName] = useState<string>('')
    const [searchByCode, setSearchByCode] = useState<string>('')
    const [searchByNameTeacher, setCourseByNameTeacher] = useState<string>('')
    const [loadingDeleteCourse, setLoadingDeleteCourse] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<any>({});
    const [sordByDate, setSortByDate] = useState<"asc" | "desc">("desc");
    const [sordByCourseName, setSortByCourseName] = useState<"asc" | "desc">("asc");
    const [onEdit, setOnEdit] = useState<Course | null>({});
    let courseRes = (auth.user?.role === 'admin') ? courses?.result : courses?.result?.filter(course => (auth.user?._id === course.teacher?._id) );
    console.log(courseRes?.length, JSON.stringify(courseRes))

    const handleClickOpen = (course: Course | null) => {
        setOnEdit(course)
        setOpen(true);
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        dispatch(changePageCourse(page))
    };

    const hanldeDeleteCourse = async (course_id: string) => {
        setLoadingDeleteCourse(course_id);
        await dispatch(deleteCourse(course_id, auth, profile))
        setLoadingDeleteCourse("")
    }

    const handleClickOpenDialog = (course_id: string) => {
        setOpenDialog({
            [`setOpen-${course_id}`]: true
        });

    };

    const handleCloseDialog = (course_id: string) => {
        setOpenDialog({
            [`setOpen-${course_id}`]: false
        });
    };

    const handleSortByCourseName = (sort: 'asc' | 'desc') => {
        setSortByCourseName(sort);
        dispatch(sortByCourseName(sort));
    }

    const hanldeSortByDate = (sort: 'asc' | 'desc') => {
        setSortByDate(sort);
        dispatch(sortByDate(sort));
    }

    const handleSearchByCourseName = (e: InputChange) => {
        setSearchByName(e.target.value)
        dispatch(searchByCourseName(e.target.value as string))
    }

    const handleSearchByCourseCode = (e: InputChange) => {
        setSearchByCode(e.target.value)
        dispatch(searchByCourseCode(e.target.value as string))
    }

    const handleSearchByCourseTeacher = (e: InputChange) => {
        setCourseByNameTeacher(e.target.value)
        dispatch(searchByCourseTeacher(e.target.value as string))
    }

    return (
        <div className="dashbroad__body course__body">
            <div className="course__control">
                <form>
                    <div className="form-group">
                        <input placeholder="T??m ki???m theo t??n m??n h???c..." type="text" onChange={handleSearchByCourseName} value={searchByName} />
                        <i className='bx bx-search'></i>
                    </div>
                    <div className="form-group">
                        <input placeholder="T??m ki???m theo m?? h???c ph???n..." type="text" onChange={handleSearchByCourseCode} value={searchByCode} />
                        <i className='bx bx-search'></i>
                    </div>
                    <div className="form-group">
                        <input placeholder="T??m ki???m theo gi??o vi??n..." type="text" onChange={handleSearchByCourseTeacher} value={searchByNameTeacher} disabled={auth.user?.role === 'teacher'}/>
                        <i className='bx bx-search'></i>
                    </div>
                </form>
                <div className="course__control-right">
                    <PrimaryTooltip title="Th??m m??n h???c">
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button color="primary" className={classes.ButtonAdd} onClick={() => handleClickOpen(null)}>
                                <i className='bx bx-plus'></i>
                                Th??m m??n h???c
                            </Button>
                        </ButtonGroup>
                    </PrimaryTooltip>
                </div>
            </div>
            <TableContainer component={Paper} className={classes.TableContainer}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {/* Table Head */}
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className={classes.TableCellHead}>STT</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>
                                <p style={{ display: "flex", alignItems: 'center' }}>
                                    {
                                        sordByCourseName === "asc" ? <i
                                            onClick={() => handleSortByCourseName("desc")}
                                            style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            className='bx bx-sort-a-z'></i>
                                            :
                                            <i
                                                onClick={() => handleSortByCourseName("asc")}
                                                className='bx bx-sort-z-a'
                                                style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            ></i>
                                    }
                                    T??n kho?? h???c
                                </p>
                            </TableCell>
                            <TableCell align="center" className={classes.TableCellHead}>M?? h???c ph???n</TableCell>
                            <TableCell align="center" className={classes.TableCellHead}>T??n ch???</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>Gi??o vi??n</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>H???c k??</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>N??m h???c</TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>Sinh vi??n</TableCell>
                            <TableCell align="left" className={classes.TableCellHead} style={{ minWidth: "120px" }}>
                                <p style={{ display: "flex", alignItems: 'center' }}>
                                    {
                                        sordByDate === "desc" ? <i
                                            onClick={() => hanldeSortByDate("asc")}
                                            style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            className='bx bx-sort-down'></i>
                                            :
                                            <i
                                                onClick={() => hanldeSortByDate("desc")}
                                                className='bx bx-sort-up'
                                                style={{ fontSize: "2rem", marginRight: '5px', cursor: "pointer" }}
                                            ></i>
                                    }
                                    Ng??y t???o
                                </p>
                            </TableCell>
                            <TableCell align="left" className={classes.TableCellHead}>H??nh ?????ng</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {/* Loading */}
                        <TableRow>
                            {
                                courses.loading && <TableCell> <h3 style={{ fontSize: "14px", padding: '10px', color: "#473fce" }}>Loading...</h3></TableCell>
                            }
                        </TableRow>
                        <TableRow>
                            {
                                ((courses.coursesLength === 0 || courseRes?.length === 0) && courses.loading !== true && courses.searching?.onSearch === false)
                                && <TableCell scope="row">
                                    {/* || courseRes?.length === 0 */}
                                    <h3 style={{ fontSize: "14px", padding: '10px', color: "#473fce" }}>Ch??a c?? m??n h???c n??o ???????c th??m</h3>
                                </TableCell>

                            }
                        </TableRow>
                        <TableRow>
                            {
                                (courses?.coursesSearch && courses.coursesSearch.length === 0 && courses.loading !== true && courses.searching?.onSearch === true)
                                && <TableCell scope="row">
                                    <h3 style={{ fontSize: "14px", padding: '10px', color: "#473fce" }}>Kh??ng t??m th???y m??n h???c h???p l???</h3>
                                </TableCell>
                            }
                        </TableRow>
                        {
                            // Check for length also
                            courses.result?.filter(course => ((auth.user?.role === 'admin') ? true : (auth.user?._id === course.teacher?._id))).map((course, index) => {
                            //courses.result?.map((course, index) => {
                            //courseRes?.map((course, index) => {
                                // return (auth.user?.role === 'admin' || auth.user?._id === course.teacher?._id) && <TableRow
                                return <TableRow
                                    key={course._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell className={classes.TableCellBody} align='center' component="th" scope="row">{(courses.page && courses.limit) && ((courses.page - 1) * courses.limit) + index + 1}</TableCell>
                                    <TableCell className={`${classes.TableCellBody} course-name`} align="left">{course.name}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="center" style={{ textTransform: "uppercase" }}>{course.courseCode}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="center">{course.credit}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="left"><h3 style={{ fontSize: "1.4rem", fontWeight: "600" }}>{course.teacher?.name}</h3> ({course.teacher?.account})</TableCell>
                                    <TableCell className={classes.TableCellBody} align="center">{course.semester}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="left">
                                        {dayjs(course.yearStart).format("YYYY")} - {dayjs(course.yearEnd).format("YYYY")}
                                    </TableCell>
                                    <TableCell className={classes.TableCellBody} align="center">
                                        {
                                            course.students?.length
                                        }
                                    </TableCell>
                                    <TableCell className={classes.TableCellBody} align="left">{dayjs(course.createdAt).format("DD/MM/YYYY")}</TableCell>
                                    <TableCell className={classes.TableCellBody} align="left">
                                        <div>
                                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                                <PrimaryTooltip title="Chi ti???t  m??n h???c" className={classes.Tooltip}>
                                                    <Button className={`${classes.Button} ${classes.ButtonInfor}`} color="primary" >
                                                        <Link to={`/course/${course._id}`} style={{ textDecoration: "none", color: '#fff', width: "100%", height: "100%" }}>
                                                            <i style={{ fontSize: "2rem" }}
                                                                className='bx bx-expand-vertical' >
                                                            </i>
                                                        </Link>
                                                    </Button>
                                                </PrimaryTooltip>
                                                {
                                                    // admin hoac teacher tao thi moi co the chinh sua hoac xoa
                                                    (auth.user?.role === 'admin' || auth.user?._id === course.teacher?._id) && <React.Fragment>
                                                        <PrimaryTooltip title="Ch???nh s???a">
                                                            <Button color="primary" onClick={() => handleClickOpen(course)} className={classes.Button} ><i className='bx bxs-edit-alt' style={{ fontSize: "2rem" }}></i></Button>
                                                        </PrimaryTooltip>
                                                        <PrimaryTooltip title="Xo??">
                                                            <Button onClick={() => handleClickOpenDialog(course?._id as string)} className={classes.Button} color="error">  <i style={{ fontSize: "2rem" }} className='bx bx-x'></i></Button>
                                                        </PrimaryTooltip>
                                                        {/* Dialog confirm delete course */}
                                                        <Dialog
                                                            open={openDialog ? openDialog[`setOpen-${course._id as string}`] ? openDialog[`setOpen-${course._id as string}`] : false : false}
                                                            onClose={handleCloseDialog}
                                                            aria-labelledby="alert-dialog-title"
                                                            aria-describedby="alert-dialog-description"
                                                        >
                                                            <h3 className='modal__heading' style={{ margin: "16px" }}>
                                                                B???n c?? ch???c mu???n xo?? m??n h???c n??y!
                                                            </h3>
                                                            <DialogActions>
                                                                <Button onClick={() => handleCloseDialog(course._id as string)} color='error'>
                                                                    <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                                                        Hu??? xo??
                                                                    </p>
                                                                </Button>
                                                                <Button onClick={() => hanldeDeleteCourse(course._id as string)} className={classes.Button}>
                                                                    {loadingDeleteCourse === course._id ? <><Loading type='small' /> <p style={{ textTransform: "initial", marginLeft: "10px" }}>??ang xo??...</p></> :
                                                                        <p style={{ textTransform: "capitalize", fontSize: '1.3rem' }}>
                                                                            ?????ng ??
                                                                        </p>}

                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </React.Fragment>
                                                }
                                            </ButtonGroup>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                (courses.coursesLength !== 0 && courseRes?.length !== 0) && <Box display='flex' justifyContent="flex-end" bgcolor="#fff" padding="16px">
                    <PaginationComponent page={(auth.user?.role === 'admin') ? courses.page as number : (Math.trunc(courseRes ? courseRes.length : 0 / 5) ? Math.trunc(courseRes ? courseRes.length : 0 / 5) : 1 as number)} variant='outlined' shape='rounded' onChange={handleChangePage} className={classes.Pagination} total={(auth.user?.role === 'admin') ? (courses.coursesLength ? courses.coursesLength : 0) : (courseRes ? courseRes.length : 0)}></PaginationComponent>
                </Box>
            }
            {/* <PaginationComponent page={courses.page as number} variant='outlined' shape='rounded' onChange={handleChangePage} className={classes.Pagination} total={courses.coursesLength ? courses.coursesLength : 0}></PaginationComponent> */}
            {/* Dialog create course */}
            {/* work out the logic for page= and total= ? */}
            <CourseFormModal open={open} hanldeSetOpen={setOpen} onEdit={onEdit} setOnEdit={setOnEdit} />
        </div >
    )
}

export default CourseBody