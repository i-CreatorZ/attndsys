/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
"use client"
"use client"
import React, { useInsertionEffect, useState } from 'react';
import {Member} from '../Marks/page.js'
import {supabase} from '../supabase.js'
import {Form} from '../Merit/page.js'

export default function Layout(){
  return(<Form database = 'demerit_records' type = "Demerit" type2 = "Deducted" type3 = "Demerit"></Form>)
}
