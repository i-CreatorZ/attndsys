
"use client"
import React, { useInsertionEffect, useState } from 'react';
import {supabase} from '../supabase.js'
import {Form} from '../Merit/page.js'

export default function Layout(){
  return(<Form database = 'demerit_records' type = "Demerit" type2 = "Deducted" type3 = "-"></Form>)
}
