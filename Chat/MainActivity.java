import com.google.firebase.FirebaseApp;

public class MyApplication extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    FirebaseApp.initializeApp(this);
  }
}

//Here is an example of how to write data to the database:

import com.google.firebase.database.FirebaseDatabase;

public class MyActivity extends AppCompatActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    FirebaseDatabase.getInstance().getReference("mydata")
      .setValue("Hello, Firebase!");
  }
}