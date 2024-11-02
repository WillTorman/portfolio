package com.example.hourscalculator

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.hourscalculator.R

class MainActivity : AppCompatActivity() , View.OnClickListener {
//    Initialize variables
    lateinit var btnCalc : Button
    lateinit var et_start : EditText
    lateinit var et_end : EditText
    lateinit var resultTv : TextView
//
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        btnCalc = findViewById(R.id.btn_calc)
        et_start = findViewById(R.id.et_start)
        et_end = findViewById(R.id.et_end)
        resultTv = findViewById(R.id.result_tv)

//        Add click listener
        btnCalc.setOnClickListener(this)
    }

    override fun onClick(v: View?) {
//        Initialize variables
        var startTime = et_start.text.toString().toDouble()
        var endTime = et_end.text.toString().toDouble()
        var result = 0.0
//        Calculate hours when button pressed
        when(v?.id){
            R.id.btn_calc ->{
                result = endTime - startTime
            }
        }
        resultTv.text = "Total hours: $result"
    }
}