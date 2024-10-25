from django.http import HttpResponse
from django.views.decorators.http import require_GET
import time
import json
import firebase_admin
from firebase_admin import credentials, firestore
from rest_framework.response import Response  # Import Response from DRF
from rest_framework.decorators import api_view  # Import api_view decorator
import pandas as pd
import joblib
from django.http import JsonResponse

# Initialize Firebase app only once
if not firebase_admin._apps:
    cred = credentials.Certificate("C:/Users/ROHITH/Downloads/my-energy-project-108-firebase-adminsdk-82dmk-9d9498e18f.json")
    firebase_admin.initialize_app(cred)

# Firestore setup
db = firestore.client()

# Initialize the index (global variable to track the current row)
index = 1

'''def create_features(df):
    """
    Extract time-based features from a DataFrame.
    """
    df = df.copy()
    df['hour'] = df.index.hour
    df['dayofweek'] = df.index.dayofweek
    df['quarter'] = df.index.quarter
    df['month'] = df.index.month
    df['year'] = df.index.year
    df['dayofyear'] = df.index.dayofyear
    return df'''

CSV_FILE_PATH = r'D:\energy_files\hourly_data.csv'

def read_row_from_csv(index):
    try:
        # Use 'skiprows' to efficiently read just the needed row
        data = pd.read_csv(CSV_FILE_PATH, skiprows=range(1, index), nrows=1)
        return data.iloc[0]  # Return the row as a Series
    except Exception as e:
        raise ValueError(f"Error reading CSV: {e}")

current_send_date = None  # Initialize as None or a default value

@api_view(['POST'])
def update_data(request):
    global index
    global current_send_date
    try:
        docs = db.collection('Values').order_by('index', direction='DESCENDING').limit(1).stream()
        current_index = 0
        for doc in docs:
            current_index = doc.to_dict().get('index', 0)

        # Read the next row from the CSV file
        row = read_row_from_csv(index + 1)
        current_send_date = row.iloc[0]
        index += 1

        # Call the get_hourly_rate function
        rate = get_hourly_rate(current_send_date)

        # Prepare data for Firebase
        firebase_data = {
            "index": int(current_index) + 1,
            "SendDate": row.iloc[0],
            "solar": float(row.iloc[1]),
            "generation": float(row.iloc[2]),
            "consumption": float(row.iloc[3]),
            "rate": rate
        }
        # Update Firebase
        #db.collection('Values').add(firebase_data)
        db.collection('Values').document(str(current_index + 1)).set(firebase_data)
        
        # Send the rate in the response
        if rate is not None:
            return JsonResponse({'current_rate': rate}, status=200)
        else:
            return JsonResponse({'error': 'Rate not found for the given hour.'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


from datetime import datetime

def get_hourly_rate(sendDate):
    try:
        # Convert sendDate string to a datetime object and extract t
        send_date = datetime.strptime(sendDate, '%m/%d/%Y %H:%M')
        hour = send_date.hour
        print(hour)
        # Load the CSV file containing tariffs
        df = pd.read_csv(r'D:\energy_files\tariff_data.csv')

        # Search for the rate corresponding to the hour
        rate_row = df[df['hour'] == hour]
        if not rate_row.empty:
            return rate_row['rate'].values[0]
        else:
            return None  # No rate found for the given hour
    except Exception as e:
        print(f"Error in get_hourly_rate: {str(e)}")
        return None


'''
def predict_from_firebase(firebase_data):
    try:
        # Create a DataFrame from the newly inserted data
        input_data = pd.DataFrame({
            'SendDate': [firebase_data['SendDate']],
            'solar': [firebase_data['solar']],
            'generation': [firebase_data['generation']],
            'consumption': [firebase_data['consumption']]
        })

        # Convert SendDate to datetime
        input_data['SendDate'] = pd.to_datetime(input_data['SendDate'])

        # Create features from the input data
        input_data.set_index('SendDate', inplace=True)
        input_features = create_features(input_data)  # Assuming create_features is defined elsewhere

        # Select relevant features for prediction
        X_input = input_features[FEATURES]  # Make sure FEATURES is defined as before

        # Generate prediction using the loaded model
        prediction = model.predict(X_input)[0]

        return prediction

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return None'''

model_path = 'api/models/daily_solar.pkl'
model = joblib.load(model_path)
model_path2 = 'api/models/daily_consum.pkl'
model2 = joblib.load(model_path2)

r'''def predict_and_plot_view(request):
    global current_send_date
    try:
        if current_send_date is None:
            return JsonResponse({'error': 'Current send date is not set.'}, status=400)

        # Convert SendDate to datetime for comparison
        firebase_send_date = pd.to_datetime(current_send_date).date()

        # Format to MM/DD/YYYY
        #firebase_send_date = fsd.strftime("%m/%d/%Y")


        print(firebase_send_date)
        # Load the CSV file with temperature data
        df = pd.read_csv(r'D:\energy_files\augmented_daily_data.csv')
        print(df['SendDate'][0])
        df['SendDate'] = pd.to_datetime(df['SendDate']).dt.date
        start_row = df[df['SendDate'] == firebase_send_date]
        #start_row = df[df['SendDate'].dt.date == firebase_send_date]
        print(type(firebase_send_date), type(df['SendDate'][0]))

        print("stttt:", start_row)
        if start_row.empty:
            print(f"No data found for the date: {firebase_send_date}")
            return None

        start_index = start_row.index[0] + 1  # Move to the next row

        # Prepare predictions for the next 5 days
        predictions = []
        prediction_dates = []

        # Loop to get the next 5 rows
        for i in range(5):
            if start_index + i < len(df):  # Ensure we don't go out of bounds
                next_row = df.iloc[start_index + i]
                next_date = next_row['SendDate']
                temp_value = next_row['Temp']

                input_data = pd.DataFrame({
                    'Temp': [temp_value],
                    'dayofyear': [pd.to_datetime(next_date).dayofyear],
                    'dayofweek': [pd.to_datetime(next_date).dayofweek],
                    'quarter': [pd.to_datetime(next_date).quarter],
                    'month': [pd.to_datetime(next_date).month],
                    'year': [pd.to_datetime(next_date).year]
                })

                # Make prediction using the model
                prediction = model.predict(input_data)[0] + 5  # Adjust the prediction
                predictions.append(prediction)
                prediction_dates.append(next_date)

        return JsonResponse({'predictions': predictions, 'dates': prediction_dates}, status=200)
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)'''

@api_view(['POST'])
def predict_and_plot_view(request):
    global current_send_date
    try:
        if current_send_date is None:
            return JsonResponse({'error': 'Current send date is not set.'}, status=400)

        firebase_send_date = pd.to_datetime(current_send_date).date()

        # Load the CSV file with temperature data
        df = pd.read_csv(r'D:\energy_files\augmented_daily_data.csv')
        df['SendDate'] = pd.to_datetime(df['SendDate']).dt.date
        start_row = df[df['SendDate'] == firebase_send_date]

        if start_row.empty:
            return JsonResponse({'error': f'No data found for the date: {firebase_send_date}'}, status=404)

        start_index = start_row.index[0] + 1  # Move to the next row

        # Prepare predictions for the next 5 days
        predictions = []
        prediction_dates = []

        for i in range(5):
            if start_index + i < len(df):
                next_row = df.iloc[start_index + i]
                next_date = next_row['SendDate']
                temp_value = next_row['Temp']

                input_data = pd.DataFrame({
                    'Temp': [temp_value],
                    'dayofyear': [pd.to_datetime(next_date).dayofyear],
                    'dayofweek': [pd.to_datetime(next_date).dayofweek],
                    'quarter': [pd.to_datetime(next_date).quarter],
                    'month': [pd.to_datetime(next_date).month],
                    'year': [pd.to_datetime(next_date).year]
                })

                # Make prediction using the model
                prediction = model.predict(input_data)[0] + 5  # Adjust the prediction
                predictions.append(float(prediction))  # Convert to float
                prediction_dates.append(next_date)

        return JsonResponse({'predictions': predictions, 'dates': prediction_dates}, status=200)
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)

#train model with data, day, solar, temp.... save model... change code..
@api_view(['POST'])
def predict_consumption(request):
    global current_send_date
    try:
        if current_send_date is None:
            return JsonResponse({'error': 'Current send date is not set.'}, status=400)

        firebase_send_date = pd.to_datetime(current_send_date).date()

        # Load the CSV file with temperature data
        df = pd.read_csv(r'D:\energy_files\augmented_daily_data.csv')
        df['SendDate'] = pd.to_datetime(df['SendDate']).dt.date
        start_row = df[df['SendDate'] == firebase_send_date]

        if start_row.empty:
            return JsonResponse({'error': f'No data found for the date: {firebase_send_date}'}, status=404)

        start_index = start_row.index[0] + 1  # Move to the next row

        # Prepare predictions for the next 5 days
        predictions = []
        prediction_dates = []

        for i in range(5):
            if start_index + i < len(df):
                next_row = df.iloc[start_index + i]
                next_date = next_row['SendDate']
                temp_value = next_row['Temp']

                input_data = pd.DataFrame({
                    'Temp': [temp_value],
                    'dayofyear': [pd.to_datetime(next_date).dayofyear],
                    'dayofweek': [pd.to_datetime(next_date).dayofweek],
                    'quarter': [pd.to_datetime(next_date).quarter],
                    'month': [pd.to_datetime(next_date).month],
                    'year': [pd.to_datetime(next_date).year]
                })

                # Make prediction using the model
                prediction = model2.predict(input_data)[0] + 5  # Adjust the prediction
                predictions.append(float(prediction))  # Convert to float
                prediction_dates.append(next_date)

        return JsonResponse({'predictions': predictions, 'dates': prediction_dates}, status=200)
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)