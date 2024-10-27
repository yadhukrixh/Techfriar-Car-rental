import React from 'react'
import Swal from 'sweetalert2'

const SwalAlert = () => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Login to Rent a Car"
      })
  return (
    <>
    </>
  )
}

export default SwalAlert;
